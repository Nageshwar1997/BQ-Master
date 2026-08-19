import { useEffect } from 'react';

import { startAutoRefreshAccessToken, stopAutoRefreshAccessToken } from '@/classes/ApiRequest';
import useUserStore from '@/stores/user.store';

// Access token expires in 15 min; refresh a bit earlier so it never expires mid-request.
const REFRESH_INTERVAL = 13 * 60 * 1000;

const useAutoRefreshAccessToken = () => {
  const authenticated = useUserStore((s) => s.authenticated);

  useEffect(() => {
    if (!authenticated) return;

    startAutoRefreshAccessToken(REFRESH_INTERVAL);

    return () => {
      stopAutoRefreshAccessToken();
    };
  }, [authenticated]);
};

export default useAutoRefreshAccessToken;
