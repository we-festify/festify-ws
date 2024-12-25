import { useCallback } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import useSearchParam from './useSearchParam';

const useSearchParamState = (key: string) => {
  const location = useLocation();
  const searchValue = useSearchParam(key);
  const [, setSearchParams] = useSearchParams();

  const setSearchValue = useCallback(
    (newValue: string) => {
      const latestSearch = new URLSearchParams(location.search);
      latestSearch.set(key, newValue);
      location.search = latestSearch.toString();
      setSearchParams(latestSearch);
    },
    [key, location, setSearchParams],
  );

  const clearSearchValue = useCallback(() => {
    const latestSearch = new URLSearchParams(location.search);
    latestSearch.delete(key);
    location.search = latestSearch.toString();
    setSearchParams(latestSearch);
  }, [key, location, setSearchParams]);

  return [searchValue ?? undefined, setSearchValue, clearSearchValue] as const;
};

export default useSearchParamState;
