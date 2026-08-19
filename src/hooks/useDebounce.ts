import { useCallback, useEffect, useRef } from 'react';

type TFunction<T extends unknown[]> = (...args: T) => void;

interface IUseDebounce<T extends unknown[]> {
  callback: TFunction<T>;
  delay?: number;
}

const useDebounce = <T extends unknown[]>({ callback, delay = 500 }: IUseDebounce<T>) => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const debounce = useCallback(
    (...args: T) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay],
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debounce;
};

export default useDebounce;
