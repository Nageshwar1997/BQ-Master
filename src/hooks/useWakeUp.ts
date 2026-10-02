import { useEffect, useState } from 'react';

import { pingGatewayWakeUp, pingServicesWakeUp } from '@/classes/ApiRequest';
import envs from '@/envs';

export type TWakeUpPhase = 'gateway' | 'services' | 'done';

export const WAKE_UP_SERVICES = Object.keys(envs.urls.services);

// Render's free tier puts an instance to sleep after ~15 min without traffic - re-waking every
// 10 min keeps it comfortably awake, and the same window is how long a wake-up is trusted.
const WAKE_UP_INTERVAL_MS = 10 * 60 * 1000;
// How often the background loop checks whether a re-wake is due (cheap - just a timestamp read).
const WAKE_UP_CHECK_INTERVAL_MS = 30 * 1000;
const LAST_WAKE_UP_KEY = 'bq:last-wake-up';

// Persisted (localStorage, not memory) so a page refresh - or another open tab - knows the backend
// was woken recently and doesn't ping it again.
const readLastWakeUp = () => {
  try {
    return Number(localStorage.getItem(LAST_WAKE_UP_KEY)) || 0;
  } catch {
    return 0;
  }
};

const saveLastWakeUp = () => {
  try {
    localStorage.setItem(LAST_WAKE_UP_KEY, String(Date.now()));
  } catch {
    // Storage blocked/full - worst case the next load just pings again.
  }
};

const isRecentlyWoken = () => Date.now() - readLastWakeUp() < WAKE_UP_INTERVAL_MS;

// How many wake-ups are in flight right now - the background loop never overlaps one.
let activeWakeUps = 0;

interface IWakeUpCallbacks {
  onGatewayDone?: () => void;
  onServiceDone?: (service: string) => void;
}

/**
 * One full wake-up: gateway first, then every service at once (Render blocks the gateway from
 * waking the services itself - backend -> backend). Never rejects. Only remembers the wake-up
 * (so refreshes/the loop skip the next ones) if something actually answered - a fully offline
 * attempt must not count, or the app would trust a wake-up that never happened.
 */
const runWakeUp = async ({ onGatewayDone, onServiceDone }: IWakeUpCallbacks = {}) => {
  activeWakeUps += 1;

  try {
    let gatewayAnswered = false;

    try {
      await pingGatewayWakeUp();
      gatewayAnswered = true;
    } catch {
      // Fail open - still try the services, they're independent of the gateway being reachable.
    }

    onGatewayDone?.();

    const servicesAnswered = await pingServicesWakeUp((service) => {
      onServiceDone?.(service);
    });

    if (gatewayAnswered || servicesAnswered > 0) saveLastWakeUp();
  } finally {
    activeWakeUps -= 1;
  }
};

/**
 * Boot-time + background wake-up for the Render-hosted backend.
 *
 * - First load with a cold/unknown backend: the 2-step wake-up runs behind a loading screen
 *   (`phase` walks `gateway` -> `services` -> `done`).
 * - Refresh within 10 min of the last wake-up: skipped entirely, straight to `done` - the backend
 *   is already awake.
 * - After that, every 10 min a SILENT re-wake runs in the background (no loading screen), but only
 *   while the tab is visible - a hidden tab doesn't keep Render awake for nobody.
 *
 * Fails open everywhere: a failed ping never leaves the app stuck on the loading screen - normal
 * API calls proceed as usual and surface their own errors through the existing toaster flow.
 */
const useWakeUp = () => {
  const [phase, setPhase] = useState<TWakeUpPhase>(() => (isRecentlyWoken() ? 'done' : 'gateway'));
  const [awakeServices, setAwakeServices] = useState<string[]>([]);

  // Initial wake-up, with progress UI - skipped when one happened recently.
  useEffect(() => {
    if (isRecentlyWoken()) return;

    let cancelled = false;
    // A function call, not a bare `cancelled` read - TS narrows a closured `let` to a literal
    // `false` after the first check (it can't see the cleanup flipping it during the `await`s),
    // which makes later checks a false-positive "always truthy" lint error.
    const isCancelled = () => cancelled;

    void runWakeUp({
      onGatewayDone: () => {
        if (!isCancelled()) setPhase('services');
      },
      onServiceDone: (service) => {
        if (!isCancelled()) setAwakeServices((prev) => [...prev, service]);
      },
    }).then(() => {
      if (!isCancelled()) setPhase('done');
    });

    return () => {
      cancelled = true;
    };
  }, []);

  // Background re-wake loop - silent, visible tabs only, never overlapping another wake-up.
  useEffect(() => {
    const tick = () => {
      if (document.visibilityState !== 'visible') return;
      if (activeWakeUps > 0 || isRecentlyWoken()) return;

      void runWakeUp();
    };

    const intervalId = setInterval(tick, WAKE_UP_CHECK_INTERVAL_MS);
    // Coming back to a tab that sat hidden past the window - re-wake right away instead of
    // waiting for the next check.
    document.addEventListener('visibilitychange', tick);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener('visibilitychange', tick);
    };
  }, []);

  return { phase, awakeServices };
};

export default useWakeUp;
