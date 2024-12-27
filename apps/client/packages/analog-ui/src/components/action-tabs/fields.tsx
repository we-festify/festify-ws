import { useListFieldsQuery } from '@analog-ui/api/canvas';
import { AnalogFieldType } from '@sharedtypes/analog';
import Draggable from '@sharedui/components/dnd/draggable';
import { Box, Calendar, Link, Type } from 'lucide-react';

const fieldTypeIcons: Record<AnalogFieldType, typeof Box> = {
  number: Box,
  datetime: Calendar,
  string: Type,
  ref: Link,
} as const;

const Fields = () => {
  const { data: { collections } = {} } = useListFieldsQuery(undefined);

  return (
    <div>
      {collections?.map((collection) => (
        <div key={collection.name} className="flex flex-col px-2">
          <h3 className="text-sm font-semibold text-muted-foreground mb-2">
            {collection.name}
          </h3>
          <div className="pl-4">
            {collection.fields.map((field) => (
              <Draggable
                key={field.key + field.type}
                type={`field-${field.type}`}
                data={{
                  type: 'field',
                  field,
                  collection: collection.name,
                }}
                render={() => {
                  const FieldIcon = fieldTypeIcons[field.type] ?? Box;
                  return (
                    <div className="text-sm hover:bg-muted dark:hover:bg-background p-2 flex items-center gap-3 rounded-md cursor-grab">
                      <FieldIcon size={14} />
                      <span>{field.key}</span>
                    </div>
                  );
                }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Fields;
