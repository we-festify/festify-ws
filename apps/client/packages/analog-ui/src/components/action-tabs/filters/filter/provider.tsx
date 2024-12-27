import { IFilter } from '@analog-ui/types/charts';
import {
  createContext,
  PropsWithChildren,
  useContext,
  useMemo,
  useState,
} from 'react';

interface FilterContextProps {
  filter: Partial<IFilter>;
  updateFilter: (filter: Partial<IFilter>) => void;
  canApply: boolean;
}

const FilterContext = createContext<FilterContextProps>({
  filter: {},
  updateFilter: () => {},
  canApply: false,
});

interface FilterProviderProps {
  filter: Partial<IFilter>;
}

const FilterProvider = ({
  children,
  filter: currentFilter,
}: PropsWithChildren<FilterProviderProps>) => {
  const [filter, setFilter] = useState(currentFilter);

  const contextValue = useMemo(
    () => ({
      filter: filter,
      updateFilter: setFilter,
      canApply:
        !!filter.collection &&
        !!filter.field &&
        !!filter.operator &&
        !!filter.value?.split(',').every((v) => !!v),
    }),
    [filter, setFilter],
  );

  return (
    <FilterContext.Provider value={contextValue}>
      {children}
    </FilterContext.Provider>
  );
};

export default FilterProvider;

// eslint-disable-next-line react-refresh/only-export-components
export const useFilter = () => {
  const context = useContext(FilterContext);

  if (!context) {
    throw new Error('useFilter must be used within a FilterContext');
  }

  return context;
};
