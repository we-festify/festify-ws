import { useSearchParams } from 'react-router-dom';

const useSearchParamState = (key: string) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const value = searchParams.get(key);

  const setValue = (newValue: string) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set(key, newValue);
    setSearchParams(newSearchParams);
  };

  const clearValue = () => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete(key);
    setSearchParams(newSearchParams);
  };

  return [value, setValue, clearValue] as const;
};

export default useSearchParamState;
