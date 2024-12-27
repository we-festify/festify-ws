import { OPERATORS } from '@analog-ui/constants/operators';
import { useFilter } from './provider';
import { Input } from '@sharedui/primitives/input';

const InputValue = () => {
  const { filter, updateFilter } = useFilter();

  if (!filter.operator) return null;

  switch (filter.operator) {
    case OPERATORS.EQUALS.value:
    case OPERATORS.NOT_EQUALS.value:
    case OPERATORS.LESS_THAN.value:
    case OPERATORS.LESS_THAN_OR_EQUAL.value:
    case OPERATORS.GREATER_THAN.value:
    case OPERATORS.GREATER_THAN_OR_EQUAL.value:
    case OPERATORS.CONTAINS.value:
    case OPERATORS.STARTS_WITH.value:
    case OPERATORS.ENDS_WITH.value:
    case OPERATORS.REGEX.value:
      return (
        <Input
          value={filter.value}
          type={
            filter.field?.type === 'number'
              ? 'number'
              : filter.field?.type === 'datetime'
                ? 'datetime-local'
                : 'text'
          }
          placeholder="Value"
          onChange={(e) => {
            const value = e.target.value;
            updateFilter({
              ...filter,
              value,
            });
          }}
        />
      );
    case OPERATORS.IN.value:
      return (
        <Input
          value={filter.value}
          placeholder="Value1, Value2, Value3"
          onChange={(e) => {
            const value = e.target.value;
            updateFilter({
              ...filter,
              value,
            });
          }}
        />
      );
    case OPERATORS.IN_RANGE.value:
    case OPERATORS.NOT_IN_RANGE.value:
      return (
        <>
          <Input
            value={filter.value?.split(',')[0]}
            type={
              filter.field?.type === 'number'
                ? 'number'
                : filter.field?.type === 'datetime'
                  ? 'datetime-local'
                  : 'text'
            }
            placeholder="Lower value"
            onChange={(e) => {
              const value = e.target.value;
              updateFilter({
                ...filter,
                value: [value, filter.value?.split(',')[1] ?? ''].join(','),
              });
            }}
          />
          <Input
            value={filter.value?.split(',')[1]}
            type={
              filter.field?.type === 'number'
                ? 'number'
                : filter.field?.type === 'datetime'
                  ? 'datetime-local'
                  : 'text'
            }
            placeholder="Upper value"
            onChange={(e) => {
              const value = e.target.value;
              updateFilter({
                ...filter,
                value: [filter.value?.split(',')[0] ?? '', value].join(','),
              });
            }}
          />
        </>
      );
    default:
      return null;
  }
};

export default InputValue;
