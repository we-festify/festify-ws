import { OPERATORS } from '@analog-ui/constants/operators';
import { IFilter } from '@analog-ui/types/charts';

interface NaturalFilterPreviewProps {
  filter: Partial<IFilter>;
  prefix?: string;
}

const NaturalFilterPreview = ({
  filter,
  prefix,
}: NaturalFilterPreviewProps) => {
  const getFieldName = (field: string) => {
    // split on any symbol like - or _
    const parts = field.split(/[-_]/);
    const name = parts.join(' ');
    return name;
  };

  const getOperator = (operator: string) => {
    switch (operator) {
      case OPERATORS.EQUALS.value:
        return 'is';
      case OPERATORS.NOT_EQUALS.value:
        return 'is not';
      case OPERATORS.GREATER_THAN.value:
        return 'is greater than';
      case OPERATORS.GREATER_THAN_OR_EQUAL.value:
        return 'is greater than or equal to';
      case OPERATORS.LESS_THAN.value:
        return 'is less than';
      case OPERATORS.LESS_THAN_OR_EQUAL.value:
        return 'is less than or equal to';
      case OPERATORS.IN.value:
        return 'is either';
      case OPERATORS.CONTAINS.value:
        return 'contains';
      case OPERATORS.IN_RANGE.value:
        return 'is between';
      case OPERATORS.NOT_IN_RANGE.value:
        return 'is not between';
      default:
        return 'is';
    }
  };

  const getFieldValue = (value: string) => {
    switch (filter.operator) {
      case OPERATORS.IN.value: {
        const values = value.split(',');
        const last = values.pop();
        return `${values.join(', ')} or ${last}`;
      }
      case OPERATORS.IN_RANGE.value:
      case OPERATORS.NOT_IN_RANGE.value: {
        const values = value.split(',');
        return `${values[0]} and ${values[1]}`;
      }
      default:
        return value;
    }
  };

  return (
    <span className="bg-muted outline outline-1 outline-muted-foreground/20 py-1 px-2 rounded-sm cursor-pointer">
      {prefix && `${prefix} `}
      {getFieldName(filter.field?.key || 'Field')}{' '}
      {filter.operator && getOperator(filter.operator)}{' '}
      <span className="font-medium">
        {getFieldValue(filter.value || 'Value')}
      </span>
    </span>
  );
};

export default NaturalFilterPreview;
