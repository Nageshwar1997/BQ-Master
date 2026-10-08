import { useOnlineStatus } from '@beautinique/frontend-hooks';
import { useEffect, useRef } from 'react';

import { toaster } from '@/utils/common.util';

// How long "Back online" stays on screen. Offline and connecting stay until the status changes.
const BACK_ONLINE_TOAST_MS = 3000;

/**
 * Tells the user when the internet goes away and when it comes back, with one toast at a time:
 * "You're offline" (stays), then "Connecting to internet..." (stays) once the network is back but
 * nothing has answered yet, then "Back online" (goes away by itself). Nothing is shown while the
 * user simply is online. Renders nothing itself.
 */
const NetworkStatusToaster = () => {
  const { status } = useOnlineStatus();
  // Set when the user loses the internet, cleared when "Back online" has been shown: that is what
  // tells "online again" from "online all along".
  const hadTroubleRef = useRef(false);

  useEffect(() => {
    if (status === 'online') {
      if (!hadTroubleRef.current) return;

      hadTroubleRef.current = false;

      const toastId = toaster.success({
        title: 'Back online',
        description: "You're connected to the internet again.",
        closeTimer: BACK_ONLINE_TOAST_MS,
      });

      return () => {
        toaster.remove(toastId);
      };
    }

    hadTroubleRef.current = true;

    const toastId =
      status === 'offline'
        ? toaster.warning({
            title: "You're offline",
            description: "Check your internet connection. We'll reconnect when it's back.",
            autoClose: false,
            isClosable: false,
          })
        : toaster.loading({
            title: 'Connecting to internet...',
            description: "Hang tight, we're getting you back online.",
          });

    return () => {
      toaster.remove(toastId);
    };
  }, [status]);

  return null;
};

export default NetworkStatusToaster;
