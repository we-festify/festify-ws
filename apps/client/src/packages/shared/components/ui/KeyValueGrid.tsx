type KeyValueType =
  | string
  | {
      key: string;
      label?: string;
      formatter?: (value: any) => string | JSX.Element;
    };

interface KeyValueListProps {
  title?: string;
  data: Record<string, any>;
  keys?: KeyValueType[];
  colsCount?: number;
}

// utility function to extract value from object
// by its key path
const extractValueFromObject = (
  object: Record<string, string>,
  keyPath: string
): string => {
  const keys = keyPath.split('.');
  let value = object as any;
  for (const key of keys) {
    value = value?.[key];
    if (!value) {
      return '';
    }
  }
  return value;
};

interface KeyValueProps {
  label: string;
  value: string;
  formatter?: (value: any) => string | JSX.Element;
}

const KeyValue = ({ label, value, formatter }: KeyValueProps) => {
  return (
    <div className="space-y-1.5">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="text-sm">{formatter ? formatter(value) : value}</div>
    </div>
  );
};

const KeyValueGrid = ({
  title,
  data,
  keys,
  colsCount = 2,
}: KeyValueListProps) => {
  return (
    <div className="flex flex-col">
      {title && <h1 className="font-semibold text-lg mb-3 mt-2">{title}</h1>}
      <div
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        style={{ gridTemplateColumns: `repeat(${colsCount}, 1fr)` }}
      >
        {keys
          ? keys.map((key) => {
              if (typeof key === 'string') {
                return (
                  <KeyValue
                    key={key}
                    label={key}
                    value={extractValueFromObject(data, key)}
                  />
                );
              } else {
                return (
                  <KeyValue
                    key={key.key}
                    label={key.label || key.key}
                    value={extractValueFromObject(data, key.key)}
                    formatter={key.formatter}
                  />
                );
              }
            })
          : null}
      </div>
    </div>
  );
};

export default KeyValueGrid;
