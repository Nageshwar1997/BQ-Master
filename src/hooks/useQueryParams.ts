import { isNullOrUndefined } from '@beautinique/shared-utils';
import { useCallback } from 'react';

import type { TStringRecord } from '@/types/hook.type';

import usePathParams from './usePathParams';

const useQueryParams = () => {
  const { navigate, search, pathname } = usePathParams();

  const getParams = useCallback((): TStringRecord => {
    const searchParams = new URLSearchParams(search);
    const params: TStringRecord = {};

    for (const [key, value] of searchParams.entries()) {
      params[key] = value;
    }

    return params;
  }, [search]);

  const setParams = useCallback(
    (params: TStringRecord | ((prevParams: TStringRecord) => TStringRecord)): void => {
      const currentParams = getParams();

      const updatedParams =
        typeof params === 'function' ? params(currentParams) : { ...currentParams, ...params };

      const searchParams = new URLSearchParams();

      Object.entries(updatedParams).forEach(([key, value]) => {
        if (!isNullOrUndefined(value) && value !== '') {
          searchParams.set(key, value);
        }
      });

      void navigate({ pathname, search: searchParams.toString() });
    },
    [getParams, navigate, pathname],
  );

  const removeParams = useCallback(
    (keys: string | string[]): void => {
      setParams((prevParams) => {
        const keysToRemove = new Set(Array.isArray(keys) ? keys : [keys]);

        return Object.fromEntries(
          Object.entries(prevParams).filter(([key]) => !keysToRemove.has(key)),
        );
      });
    },
    [setParams],
  );

  const clearParams = useCallback((): void => {
    void navigate({ pathname, search: '' });
  }, [navigate, pathname]);

  return {
    queryParams: getParams(),
    setParams,
    removeParams,
    clearParams,
  };
};

export default useQueryParams;
