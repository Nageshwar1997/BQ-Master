import { useEffect, useState } from 'react';

import { pingGatewayWakeUp } from '@/classes/ApiRequest';

type TWakeUpStatus = 'loading' | 'success' | 'error';

/**
 * Pings the gateway (and every downstream service behind it) once on mount, so a cold Render
 * instance wakes up before the user's first real request hits it. Returns 'loading' while the
 * ping is in flight - render a loading screen for that state, same as any other boot gate.
 *
 * Fails open: a failed ping still resolves to 'error' (not stuck 'loading' forever) - normal API
 * calls proceed as usual and surface their own errors through the existing toaster/ApiStatus flow.
 */
const useWakeUpGateway = () => {
  const [status, setStatus] = useState<TWakeUpStatus>('loading');

  useEffect(() => {
    let cancelled = false;

    pingGatewayWakeUp()
      .then(() => {
        if (!cancelled) setStatus('success');
      })
      .catch(() => {
        if (!cancelled) setStatus('error');
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return status;
};

export default useWakeUpGateway;
