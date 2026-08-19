import useActionsStore from '@/stores/action.store';
import useUserStore from '@/stores/user.store';

import useQueryParams from './useQueryParams';

const useAuthAction = () => {
  const user = useUserStore((s) => s.user);
  const addAction = useActionsStore((s) => s.addAction);
  const { queryParams, setParams } = useQueryParams();

  const runAction = (action: () => void | Promise<void>, options?: { maxRetries?: number }) => {
    // ✅ already logged-in → run immediately
    if (user) {
      try {
        const result = action();

        // async safe
        if (result instanceof Promise) {
          result.catch((err: unknown) => {
            console.error('Action failed:', err);
          });
        }
      } catch (err) {
        console.error('Action error:', err);
      }

      return;
    }

    // ❌ not logged-in → queue
    addAction(action, options);

    // 🔥 open login modal only once
    if (!queryParams.login) {
      setParams({ login: 'true' });
    }
  };

  return { runAction };
};

export default useAuthAction;
