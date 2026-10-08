import { onlineStatusStore } from '@beautinique/frontend-hooks';
import { MutationCache, onlineManager, QueryCache, QueryClient } from '@tanstack/react-query';

/*
 * React Query decides whether to fetch from the browser's `online` / `offline` events alone, which
 * say nothing when the Wi-Fi has no internet behind it. Give it the real status: while there is no
 * internet (or it is only connecting) queries and mutations wait instead of failing and showing an
 * error, and they carry on (refetching the queries that ask for it) once the internet is back.
 */
onlineManager.setEventListener((setOnline) => {
  const sync = () => {
    setOnline(onlineStatusStore.getStatus() === 'online');
  };

  sync();

  return onlineStatusStore.subscribe(sync);
});

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: (failureCount) => failureCount < 3,
    },
    mutations: { retry: false },
  },

  queryCache: new QueryCache({
    onError: (error, query) => {
      console.error('❌ Query Error:', {
        queryKey: query.queryKey,
        error,
      });
    },
  }),

  mutationCache: new MutationCache({
    onError: (error, variables, _context, mutation) => {
      console.error('❌ Mutation Error:', {
        mutationKey: mutation.options.mutationKey,
        variables,
        error,
      });
    },
  }),
});
