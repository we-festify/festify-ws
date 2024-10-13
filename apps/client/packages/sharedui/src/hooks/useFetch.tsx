import { useCallback, useEffect, useState } from 'react';
import { getErrorMessage } from '../utils/error';

export const useFetch = <T,>(
  url: string,
  options?: RequestInit & {
    skip?: boolean;
    responseFormatter?: (res: Response) => Promise<T>;
  },
) => {
  const [data, setData] = useState<T | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [refetchTrigger, setRefetchTrigger] = useState(true);

  const fetchData = useCallback(async () => {
    if (!url) return;
    if (options?.skip) return;

    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error(response.statusText);
      if (options?.responseFormatter) {
        setData(await options.responseFormatter(response));
      } else {
        setData(await response.json());
      }
      setError(undefined);
    } catch (error) {
      setError(getErrorMessage(error));
      setData(undefined);
    } finally {
      setIsLoading(false);
    }
  }, [url, options]);

  useEffect(() => {
    fetchData();
  }, [fetchData, refetchTrigger]);

  return {
    data,
    error,
    isFetching: isLoading,
    refetch: () => setRefetchTrigger((prev) => !prev),
  };
};
