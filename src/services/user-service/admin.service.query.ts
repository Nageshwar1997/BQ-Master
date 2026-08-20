import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { adminTerritoryApi } from '@/classes/apis';
import { API_QUERY_KEYS } from '@/constants/api.constants';
import { handleApiErrorToaster, handleApiSuccessToaster } from '@/utils/api.util';
import { toaster } from '@/utils/common.util';

const { assign, map, status } = API_QUERY_KEYS.user_service.admin.territory;

export const useGetTerritoryMap = () => {
  return useQuery({
    queryKey: map,
    queryFn: adminTerritoryApi.getTerritoryMap,

    staleTime: 60 * 1000,
    gcTime: 15 * 60 * 1000,

    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: true,

    select: (data) => data.data ?? [],
  });
};

export const useAssignAdminTerritory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: assign({ adminId: '' }),
    mutationFn: adminTerritoryApi.assignAdminTerritory,
    onMutate: () => {
      const toastId = toaster.loading({
        title: 'Please wait...',
        description: 'Assigning territory...',
      });
      return { toastId };
    },
    onSuccess: async ({ message }) => {
      await queryClient.invalidateQueries({ queryKey: map });
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

export const useUpdateAdminStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: status({ adminId: '' }),
    mutationFn: adminTerritoryApi.updateAdminStatus,
    onMutate: () => {
      const toastId = toaster.loading({
        title: 'Please wait...',
        description: 'Updating admin status...',
      });
      return { toastId };
    },
    onSuccess: async ({ message }) => {
      await queryClient.invalidateQueries({ queryKey: map });
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
