export type KeyValueType =
  | string
  | {
      key: string;
      label?: string;
      formatter?: (value: unknown) => string | JSX.Element;
    };

interface KeyValueProps {
  label: string;
  value: unknown;
  formatter?: (value: unknown) => string | JSX.Element;
}

function KeyValue({ label, value, formatter }: Readonly<KeyValueProps>) {
  return (
    <div className="space-y-1.5">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="text-sm">
        {formatter ? formatter(value) : value?.toString()}
      </div>
    </div>
  );
}

interface KeyValueGridProps<TData extends Record<string, unknown>> {
  title?: string;
  data: TData;
  keys?: KeyValueType[];
  colsCount?: number;
}

function KeyValueGrid<TData extends Record<string, unknown>>({
  title,
  data,
  keys,
  colsCount = 2,
}: Readonly<KeyValueGridProps<TData>>) {
  return (
    <div className="flex flex-col">
      {title && <h1 className="font-semibold text-lg mb-3 mt-2">{title}</h1>}
      <div
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        style={{ gridTemplateColumns: `repeat(${colsCount}, auto)` }}
      >
        {keys
          ? keys.map((currentKey) => {
              if (typeof currentKey === 'string') {
                return (
                  <KeyValue
                    key={currentKey}
                    label={currentKey}
                    value={data[currentKey]}
                  />
                );
              } else {
                return (
                  <KeyValue
                    key={currentKey.key}
                    label={currentKey.label ?? currentKey.key}
                    value={data[currentKey.key]}
                    formatter={currentKey.formatter}
                  />
                );
              }
            })
          : null}
      </div>
    </div>
  );
}

export default KeyValueGrid;
