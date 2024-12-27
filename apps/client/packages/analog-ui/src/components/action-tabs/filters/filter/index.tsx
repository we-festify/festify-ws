import { IFilter } from '@analog-ui/types/charts';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@sharedui/primitives/popover';
import ChooseOperator from './choose-operator';
import ChooseFieldAndCollection from './choose-field-collection';
import InputValue from './input-value';
import FilterProvider from './provider';
import ApplyButton from './apply-button';
import FilterPreview from './preview';
import { useFilters } from '..';

interface FilterProps {
  filter: Partial<IFilter>;
  prefix?: string;
  onUpdate?: (filter: IFilter) => void;
  onDelete?: () => void;
}

const Filter = ({
  filter,
  prefix,
  onUpdate = () => {},
  onDelete,
}: FilterProps) => {
  const { showNaturalLanguage } = useFilters();

  return (
    <div className="text-sm">
      <Popover>
        <PopoverTrigger className="w-full">
          <FilterPreview
            filter={filter}
            natural={showNaturalLanguage}
            prefix={prefix}
            onDelete={onDelete}
          />
        </PopoverTrigger>
        <PopoverContent className="shadow-xl">
          <FilterProvider filter={filter}>
            <div className="flex flex-col gap-4">
              <ChooseFieldAndCollection />
              <ChooseOperator />
              <InputValue />
              <ApplyButton onApply={onUpdate} />
            </div>
          </FilterProvider>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default Filter;
