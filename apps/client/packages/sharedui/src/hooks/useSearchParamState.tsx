import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

const useSearchParamState = (key: string) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const value = searchParams.get(key) ?? undefined;

  const setValue = useCallback(
    (newValue: string) => {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set(key, newValue);
      setSearchParams(newSearchParams);
    },
    [key, searchParams, setSearchParams],
  );

  const clearValue = useCallback(() => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete(key);
    setSearchParams(newSearchParams);
  }, [key, searchParams, setSearchParams]);

  return [value, setValue, clearValue] as const;
};

export default useSearchParamState;
