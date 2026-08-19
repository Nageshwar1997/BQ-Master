import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { categoryApi } from '@/classes/apis';
import { API_QUERY_KEYS } from '@/constants/api.constants';
import { EMPTY_ARRAY } from '@/constants/common.constants';
import type { TL1Category, TL2Category, TL3Category } from '@/types/api.type';
import { handleApiErrorToaster, handleApiSuccessToaster } from '@/utils/api.util';
import { toaster } from '@/utils/common.util';

const { get, add, update, delete: remove } = API_QUERY_KEYS.product_service.category;

export const useAddCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: add,
    mutationFn: categoryApi.addCategory,
    onMutate: () => {
      const toastId = toaster.loading({
        title: 'Please wait...',
        description: 'Adding category...',
      });
      return { toastId };
    },
    onSuccess: async ({ message }) => {
      handleApiSuccessToaster(message);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: get.byParentLevel }),
        queryClient.invalidateQueries({ queryKey: get.byHierarchy }),
      ]);
    },

    onError: (error) => {
      handleApiErrorToaster(error);
    },
    onSettled: (_data, _error, _variables, context) => {
      if (context?.toastId) toaster.remove(context.toastId);
    },
  });
};

export const useUpdateCategory = ({ categoryId = '' }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: update({ categoryId }),
    mutationFn: categoryApi.updateCategory,
    onMutate: () => {
      const toastId = toaster.loading({
        title: 'Please wait...',
        description: 'Updating category...',
      });
      return { toastId };
    },
    onSuccess: async ({ message }) => {
      handleApiSuccessToaster(message);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: get.byParentLevel }),
        queryClient.invalidateQueries({ queryKey: get.byHierarchy }),
      ]);
    },
    onError: (error) => {
      handleApiErrorToaster(error);
    },
    onSettled: (_data, _error, _variables, context) => {
      if (context?.toastId) toaster.remove(context.toastId);
    },
  });
};

export const useDeleteCategory = ({ categoryId = '' }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: remove({ categoryId }),
    mutationFn: categoryApi.deleteCategory,
    onMutate: () => {
      const toastId = toaster.loading({
        title: 'Please wait...',
        description: 'Deleting category...',
      });
      return { toastId };
    },
    onSuccess: async ({ message }) => {
      handleApiSuccessToaster(message);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: get.byParentLevel }),
        queryClient.invalidateQueries({ queryKey: get.byHierarchy }),
      ]);
    },
    onError: (error) => {
      handleApiErrorToaster(error);
    },
    onSettled: (_data, _error, _variables, context) => {
      if (context?.toastId) toaster.remove(context.toastId);
    },
  });
};

export const useGetCategoriesByParentLevel = ({
  enabled = true,
  ...props
}: { enabled?: boolean } & (
  | Pick<TL1Category, 'level'>
  | Pick<TL2Category, 'level' | 'parent'>
  | Pick<TL3Category, 'level' | 'parent'>
)) => {
  return useQuery({
    queryKey: [...get.byParentLevel, Object.values(props)],
    queryFn: () => categoryApi.getCategoriesByParentLevel(props),
    staleTime: 5 * 60 * 1000, // 5 min
    gcTime: 15 * 60 * 1000, // 15 min
    enabled: enabled,
    placeholderData: (prev) => prev,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: true,
    select: (data) => data.data ?? EMPTY_ARRAY,
  });
};

export const useGetCategoriesHierarchy = () => {
  return useQuery({
    queryKey: get.byHierarchy,
    queryFn: categoryApi.getCategoriesHierarchy,

    // Cache
    staleTime: 5 * 60 * 1000, // 5 min
    gcTime: 15 * 60 * 1000, // 15 min

    // Refetch
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,

    // Retry
    retry: 1,

    // UX
    placeholderData: (prev) => prev,
    select: (data) => data.data ?? EMPTY_ARRAY,
  });
};
