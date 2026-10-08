// @vitest-environment jsdom
import { act } from 'react';
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  type Mock,
  type MockInstance,
  vi,
} from 'vitest';

import useActionsStore from '@/stores/action.store';
import { renderHook, unmountAll } from '@/test-utils/react';

import useAutoRetry from './useAutoRetry';

let navigatorOnline: MockInstance<() => boolean>;
let reachable = true;

const setNavigatorOnline = (value: boolean) => {
  navigatorOnline.mockReturnValue(value);
};

const goOffline = () => {
  act(() => {
    setNavigatorOnline(false);
    window.dispatchEvent(new Event('offline'));
  });
};

const goOnline = () => {
  act(() => {
    setNavigatorOnline(true);
    window.dispatchEvent(new Event('online'));
  });
};

const settle = async (ms = 0) => {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(ms);
  });
};

// What failed while there was no internet is run again when the internet is back, which is when it
// has been confirmed, not when the browser says "online": a network that has just come back often
// has no internet yet, and an action run then would only fail again.
describe('useAutoRetry', () => {
  let runAllActions: Mock<() => Promise<void>>;
  let originalRunAllActions: () => Promise<void>;

  beforeEach(() => {
    vi.useFakeTimers();
    navigatorOnline = vi.spyOn(window.navigator, 'onLine', 'get');
    setNavigatorOnline(true);
    vi.spyOn(document, 'visibilityState', 'get').mockReturnValue('visible');
    reachable = true;
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        reachable
          ? Promise.resolve(new Response(null, { status: 204 }))
          : Promise.reject(new TypeError('Failed to fetch')),
      ),
    );
    originalRunAllActions = useActionsStore.getState().runAllActions;
    runAllActions = vi.fn<() => Promise<void>>(() => Promise.resolve());
    useActionsStore.setState({ runAllActions });
  });

  afterEach(() => {
    unmountAll();
    useActionsStore.setState({ runAllActions: originalRunAllActions });
    vi.useRealTimers();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    document.body.replaceChildren();
  });

  it('does nothing while the user is simply online', async () => {
    const view = renderHook(useAutoRetry);

    await settle(60_000);
    act(() => {
      window.dispatchEvent(new Event('online'));
    });

    expect(runAllActions).not.toHaveBeenCalled();
    view.unmount();
  });

  it('runs them once when the internet is back after the network was gone', async () => {
    const view = renderHook(useAutoRetry);
    goOffline();
    expect(runAllActions).not.toHaveBeenCalled();

    goOnline();
    await settle();

    expect(runAllActions).toHaveBeenCalledTimes(1);
    view.unmount();
  });

  it('waits while the network is back but the internet has not answered yet', async () => {
    const view = renderHook(useAutoRetry);
    goOffline();
    reachable = false;

    goOnline(); // the browser says "online"
    await settle();
    expect(runAllActions).not.toHaveBeenCalled();

    await settle(500);
    expect(runAllActions).not.toHaveBeenCalled();

    reachable = true;
    await settle(1000);
    expect(runAllActions).toHaveBeenCalledTimes(1);
    view.unmount();
  });

  it('runs them after the internet went away with the Wi-Fi still joined, once it is back', async () => {
    const view = renderHook(useAutoRetry);
    reachable = false;

    await settle(15_000);
    await settle(500); // two checks without an answer: offline
    expect(runAllActions).not.toHaveBeenCalled();

    reachable = true;
    await settle(1000);

    expect(runAllActions).toHaveBeenCalledTimes(1);
    view.unmount();
  });

  it('runs them again the next time the internet goes away and comes back', async () => {
    const view = renderHook(useAutoRetry);

    for (let round = 1; round <= 3; round += 1) {
      goOffline();
      goOnline();
      await settle();
      expect(runAllActions).toHaveBeenCalledTimes(round);
    }
    view.unmount();
  });

  it('runs them once, also under StrictMode', async () => {
    const view = renderHook(useAutoRetry, { strict: true });
    expect(runAllActions).not.toHaveBeenCalled();

    goOffline();
    goOnline();
    await settle();

    expect(runAllActions).toHaveBeenCalledTimes(1);
    view.unmount();
  });

  it('stops listening when it is unmounted', async () => {
    const view = renderHook(useAutoRetry);
    goOffline();
    view.unmount();

    goOnline();
    await settle();

    expect(runAllActions).not.toHaveBeenCalled();
    expect(vi.getTimerCount()).toBe(0);
  });
});
