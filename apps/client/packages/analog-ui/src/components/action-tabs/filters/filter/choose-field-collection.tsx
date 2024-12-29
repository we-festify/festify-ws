import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@sharedui/primitives/select';
import { useListFieldsQuery } from '@analog-ui/api/canvas';
import { useFilter } from './provider';

const ChooseFieldAndCollection = () => {
  const { data: { collections } = {} } = useListFieldsQuery(undefined);
  const { filter, updateFilter } = useFilter();

  console.table(filter);

  return (
    <Select
      value={
        filter.field?.key && filter.collection
          ? `${filter.field?.key}-${filter.collection}`
          : undefined
      }
      onValueChange={(value) => {
        const [fieldName, collection] = value.split('-');
        const field = collections
          ?.find((c) => c.name === collection)
          ?.fields.find((f) => f.key === fieldName);
        if (field) {
          updateFilter({
            ...filter,
            field,
            collection,
          });
        }
      }}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Choose a field" />
      </SelectTrigger>
      <SelectContent>
        {collections?.map((collection) => {
          return (
            <SelectGroup key={collection.name}>
              <SelectLabel>{collection.name}</SelectLabel>
              {collection.fields.map((field) => (
                <SelectItem
                  key={`${field.key}-${collection.name}`}
                  value={`${field.key}-${collection.name}`}
                >
                  {field.key}
                </SelectItem>
              ))}
            </SelectGroup>
          );
        })}
      </SelectContent>
    </Select>
  );
};

export default ChooseFieldAndCollection;
