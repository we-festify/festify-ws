import { IFilterGroup } from '@sharedtypes/analog/charts';
import Filter from './filter';
import { Button } from '@sharedui/primitives/button';
import { Plus, X } from 'lucide-react';

interface FilterGroupProps {
  group: IFilterGroup;
  onUpdate?: (group: IFilterGroup) => void;
  onDelete?: () => void;
}

const FilterGroup = ({ group, onDelete, onUpdate }: FilterGroupProps) => {
  return (
    <div className="flex flex-col gap-1 outline outline-1 outline-muted-foreground/20 p-1 rounded-md">
      {group.filters.map((filter, index) => (
        <Filter
          key={index}
          filter={filter}
          prefix={index === 0 ? '' : 'and'}
          onUpdate={(filter) => {
            onUpdate?.({
              ...group,
              filters: group.filters.map((f, i) => (i === index ? filter : f)),
            });
          }}
          onDelete={() => {
            onUpdate?.({
              ...group,
              filters: group.filters.filter((_, i) => i !== index),
            });
          }}
        />
      ))}
      <div className="flex justify-end text-sm text-muted-foreground mt-2">
        <Button
          variant="ghost"
          size="sm"
          className="h-auto py-1 px-2 flex gap-1 hover:bg-muted dark:hover:bg-background"
          title="Add filter"
          onClick={() => {
            onUpdate?.({
              ...group,
              filters: [
                ...group.filters,
                {
                  field: { key: '', type: 'string' },
                  collection: '',
                  operator: 'eq',
                  value: '',
                },
              ],
            });
          }}
        >
          <Plus size={14} />
          <span>Add filter</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-auto py-1 px-2 flex gap-1 hover:text-destructive hover:bg-muted dark:hover:bg-background"
          title="Delete filter group"
          onClick={onDelete}
        >
          <X size={14} />
        </Button>
      </div>
    </div>
  );
};

export default FilterGroup;
