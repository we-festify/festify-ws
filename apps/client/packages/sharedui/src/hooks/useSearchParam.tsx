import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

const useSearchParam = (key: string) => {
  const location = useLocation();

  const value = useMemo(
    () => new URLSearchParams(location.search).get(key),
    [key, location.search],
  );

  return value;
};

export default useSearchParam;
