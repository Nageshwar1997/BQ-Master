import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { productApi } from '@/classes/apis';
import { API_QUERY_KEYS } from '@/constants/api.constants';
import type { IGetDashboardProductsQuery } from '@/types/api.type';
import { handleApiErrorToaster, handleApiSuccessToaster } from '@/utils/api.util';
import { toaster } from '@/utils/common.util';

const { draft, get } = API_QUERY_KEYS.product_service.product;

export const useSaveDraftProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: draft.save,
    mutationFn: productApi.saveDraftProduct,
    onMutate: () => {
      const toastId = toaster.loading({
        title: 'Please wait...',
        description: 'Saving your product in draft...',
      });
      return { toastId };
    },
    onSuccess: async ({ message }) => {
      await queryClient.invalidateQueries({ queryKey: [draft.get] });
      handleApiSuccessToaster(message);
    },
    onError: (error) => {
      handleApiErrorToaster(error);
    },
    onSettled: (_data, _error, _variables, context) => {
      if (context?.toastId) toaster.remove(context.toastId);
    },
  });
};

export const usePublishProduct = () => {
  return useMutation({
    mutationKey: draft.publish,
    mutationFn: productApi.publishDraftProduct,
    onMutate: () => {
      const toastId = toaster.loading({
        title: 'Please wait...',
        description: 'Sending your product for approval...',
      });
      return { toastId };
    },
    onSuccess: ({ message }) => {
      handleApiSuccessToaster(message);
    },
    onError: (error) => {
      handleApiErrorToaster(error);
    },
    onSettled: (_data, _error, _variables, context) => {
      if (context?.toastId) toaster.remove(context.toastId);
    },
  });
};

export const useGetDraftProduct = () => {
  return useQuery({
    queryKey: draft.get,
    queryFn: productApi.getDraftProduct,
    retry: false,
    select: (data) => data.data,
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    placeholderData: (prev) => prev,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });
};

export const useGetDashboardProducts = (
  params: Omit<IGetDashboardProductsQuery, 'page' | 'limit'>,
) => {
  return useInfiniteQuery({
    queryKey: [...get.dashboard.products, ...Object.values(params)],
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      productApi.getDashboardProducts({ ...params, page: pageParam.toString(), limit: '15' }),
    getNextPageParam: (lastPage) => {
      const pagination = lastPage.data?.pagination;

      if (!pagination) return undefined;

      return pagination.page < pagination.totalPages ? pagination.page + 1 : undefined;
    },

    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,

    placeholderData: (prev) => prev,

    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: true,
    select: (data) => ({
      products: data.pages.flatMap((page) => page.data?.products ?? []),
      counts: data.pages[0]?.data?.counts,
    }),
  });
};

export const useGetDashboardProductBySlug = (slug: string) => {
  return useQuery({
    queryKey: [...get.dashboard.bySlug({ slug }), slug],
    queryFn: () => productApi.getDashboardProductBySlug(slug),
    enabled: !!slug,
    select: (data) => data.data,
  });
};
