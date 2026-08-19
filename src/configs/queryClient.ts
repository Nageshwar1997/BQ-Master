import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';

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
