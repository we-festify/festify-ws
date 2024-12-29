import { OPERATORS_BY_FIELD_TYPE } from '@analog-ui/constants/operators';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@sharedui/primitives/select';
import { useFilter } from './provider';
import { OperatorType } from '@sharedtypes/analog/operators';

const ChooseOperator = () => {
  const { filter, updateFilter } = useFilter();
  const operators = OPERATORS_BY_FIELD_TYPE[filter.field?.type ?? 'string'];

  return (
    <Select
      disabled={!filter.field || !filter.collection}
      value={filter.operator}
      onValueChange={(value) => {
        updateFilter({
          ...filter,
          operator: value as OperatorType,
        });
      }}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Choose an operator" />
      </SelectTrigger>
      <SelectContent>
        {operators.map((operator) => (
          <SelectItem key={operator.value} value={operator.value}>
            {operator.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
export default ChooseOperator;
