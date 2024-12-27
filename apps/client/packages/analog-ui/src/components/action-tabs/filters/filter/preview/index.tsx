import { IFilter } from '@analog-ui/types/charts';
import { X } from 'lucide-react';
import OperatorPreview from './operator';
import NaturalFilterPreview from './natural';

interface FilterPreviewProps {
  filter: Partial<IFilter>;
  natural?: boolean;
  prefix?: string;
  onDelete?: () => void;
}

const FilterPreview = ({
  filter,
  natural,
  prefix,
  onDelete,
}: FilterPreviewProps) => {
  return (
    <div className="flex gap-2">
      <div className="flex gap-1 text-sm flex-wrap break-words text-left">
        {natural ? (
          <NaturalFilterPreview filter={filter} prefix={prefix} />
        ) : (
          <>
            <span className="bg-muted outline outline-1 outline-muted-foreground/20 py-1 px-2 rounded-sm cursor-pointer">
              {filter.field?.key || 'Field'}
            </span>
            <OperatorPreview operator={filter.operator ?? 'eq'} />
            <span className="bg-muted outline outline-1 outline-muted-foreground/20 py-1 px-2 rounded-sm cursor-pointer">
              {filter.value || 'Value'}
            </span>
          </>
        )}
      </div>
      <span
        className="ml-auto text-muted-foreground hover:text-destructive hover:bg-muted dark:hover:bg-background py-1 px-2 rounded-sm cursor-pointer flex items-center justify-center"
        onClick={(e) => {
          e.stopPropagation();
          onDelete?.();
        }}
        title={`Delete filter on ${filter.field?.key}`}
      >
        <X size={14} />
      </span>
    </div>
  );
};

export default FilterPreview;
