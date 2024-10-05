export type KeyValueType =
  | string
  | {
      key: string;
      label?: string;
      formatter?: (value: any) => string | JSX.Element;
    };

interface KeyValueProps {
  label: string;
  value: any;
  formatter?: (value: any) => string | JSX.Element;
}

function KeyValue({ label, value, formatter }: KeyValueProps) {
  return (
    <tr className="even:bg-muted">
      <td className="text-sm text-muted-foreground p-2 border-0 rounded-tl rounded-bl">
        {label}
      </td>
      <td className="text-sm p-2 border-0 rounded-tr rounded-br">
        {formatter ? formatter(value) : value?.toString()}
      </td>
    </tr>
  );
}

interface KeyValueListProps<TData extends Record<string, any>> {
  title?: string;
  data: TData;
  keys?: KeyValueType[];
}

function KeyValueList<TData extends Record<string, any>>({
  title,
  data,
  keys,
}: KeyValueListProps<TData>) {
  return (
    <div className="flex flex-col">
      {title && <h1 className="font-semibold text-lg mb-3 mt-2">{title}</h1>}
      <table className="w-full">
        <tbody className="w-full">
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
                      label={currentKey.label || currentKey.key}
                      formatter={currentKey.formatter}
                      value={data[currentKey.key]}
                    />
                  );
                }
              })
            : Object.entries(data).map(([key, value]) => (
                <KeyValue key={key} label={key} value={value} />
              ))}
        </tbody>
      </table>
    </div>
  );
}

export default KeyValueList;
