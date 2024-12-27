import { useCanvas } from '@analog-ui/components/canvas/provider';
import { selectTileById, updateFilterGroups } from '@analog-ui/store/canvas';
import { useDispatch, useSelector } from 'react-redux';
import FilterGroup from './filter-group';
import { Button } from '@sharedui/primitives/button';
import { Plus } from 'lucide-react';
import { createContext, useContext, useMemo, useState } from 'react';
import { Switch } from '@sharedui/primitives/switch';

interface FiltersContextProps {
  showNaturalLanguage: boolean;
}

export const FiltersContext = createContext<FiltersContextProps>({
  showNaturalLanguage: false,
});

const Filters = () => {
  const { activeTileId } = useCanvas();
  const tile = useSelector(selectTileById(activeTileId ?? ''));
  const [showNaturalLanguage, setShowNaturalLanguage] = useState(false);
  const dispatch = useDispatch();

  const contextValue = useMemo(
    () => ({
      showNaturalLanguage,
    }),
    [showNaturalLanguage],
  );

  return (
    <FiltersContext.Provider value={contextValue}>
      <div className="px-3 flex flex-col gap-2">
        <div className="w-full flex justify-end items-center gap-2">
          <span className="text-muted-foreground text-sm">
            natural language
          </span>
          <Switch
            checked={showNaturalLanguage}
            onCheckedChange={setShowNaturalLanguage}
          />
        </div>
        {tile?.metadata?.filterGroups?.map((filterGroup, index) => (
          <FilterGroup
            key={index}
            group={filterGroup}
            onUpdate={(group) => {
              dispatch(
                updateFilterGroups({
                  tile: tile?._id,
                  groups: tile?.metadata?.filterGroups?.map((g) =>
                    g === filterGroup ? group : g,
                  ),
                }),
              );
            }}
            onDelete={() => {
              dispatch(
                updateFilterGroups({
                  tile: tile?._id,
                  groups:
                    tile?.metadata?.filterGroups?.filter(
                      (g) => g !== filterGroup,
                    ) ?? [],
                }),
              );
            }}
          />
        ))}
        <Button
          variant="ghost"
          size="sm"
          className="h-auto py-1 px-2 flex gap-1 w-max text-sm self-end text-muted-foreground hover:bg-muted dark:hover:bg-background"
          onClick={() => {
            dispatch(
              updateFilterGroups({
                tile: tile?._id,
                groups: [
                  ...(tile?.metadata?.filterGroups ?? []),
                  {
                    filters: [
                      {
                        field: { key: '', type: 'string' },
                        collection: '',
                        operator: 'eq',
                        value: '',
                      },
                    ],
                  },
                ],
              }),
            );
          }}
        >
          <Plus size={14} />
          <span>Filter group</span>
        </Button>
      </div>
    </FiltersContext.Provider>
  );
};

export default Filters;

// eslint-disable-next-line react-refresh/only-export-components
export const useFilters = () => {
  const context = useContext(FiltersContext);

  if (!context) {
    throw new Error('useFilters must be used within a FiltersProvider');
  }

  return context;
};
