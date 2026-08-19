import { useEffect } from 'react';

import useActionsStore from '@/stores/action.store';

const useAutoRetry = () => {
  useEffect(() => {
    const handleOnline = () => {
      void useActionsStore.getState().runAllActions();
    };

    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('online', handleOnline);
    };
  }, []);
};

export default useAutoRetry;
