import { useEffect } from 'react';

import { ROUTES } from '@/constants/common.constants';
import usePathParams from '@/hooks/usePathParams';
import useUserStore from '@/stores/user.store';

const useAuthLogoutListener = () => {
  const setUser = useUserStore((s) => s.setUser);
  const { navigate } = usePathParams();

  useEffect(() => {
    const handleLogout = () => {
      setUser(null);
      void navigate(`/${ROUTES.AUTH.BASE}`);
    };

    window.addEventListener('auth:logout', handleLogout);

    return () => {
      window.removeEventListener('auth:logout', handleLogout);
    };
  }, [setUser, navigate]);
};

export default useAuthLogoutListener;
