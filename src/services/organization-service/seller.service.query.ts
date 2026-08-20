import { useQuery } from '@tanstack/react-query';

import { sellerApi } from '@/classes/apis';
import { API_QUERY_KEYS } from '@/constants/api.constants';
import type { ISellerQueueQuery } from '@/types/api.type';

const { queue } = API_QUERY_KEYS.organization_service.seller;

export const useGetSellerQueue = (params: ISellerQueueQuery) => {
  return useQuery({
    queryKey: [...queue, params.status, params.filter] as const,
    queryFn: () => sellerApi.getSellerQueue(params),

    staleTime: 2 * 60 * 1000,
    gcTime: 15 * 60 * 1000,

    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: true,

    select: (data) => data.data ?? [],
  });
};
