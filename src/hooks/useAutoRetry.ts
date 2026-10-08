import { useOnlineStatus } from '@beautinique/frontend-hooks';
import { useEffect, useRef } from 'react';

import useActionsStore from '@/stores/action.store';

/**
 * Runs the actions that failed while there was no internet, as soon as the internet is back. That is
 * when it has been confirmed, not when the browser says "online": a network that has just come back
 * often has no internet yet, and an action run then would only fail again.
 */
const useAutoRetry = () => {
  const { isOnline } = useOnlineStatus();
  // Set while the internet is away, cleared when it is back and the actions have been run.
  const wasAwayRef = useRef(false);

  useEffect(() => {
    if (!isOnline) {
      wasAwayRef.current = true;

      return;
    }

    if (!wasAwayRef.current) return;

    wasAwayRef.current = false;
    void useActionsStore.getState().runAllActions();
  }, [isOnline]);
};

export default useAutoRetry;
