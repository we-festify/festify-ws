type KeyValueType =
  | string
  | {
      key: string;
      label?: string;
      formatter?: (value: any) => string | JSX.Element;
    };

interface KeyValueListProps {
  title?: string;
  data: Record<string, string>;
  keys?: KeyValueType[];
}

// utility function to extract value from object
// by its key path
const extractValueFromObject = (
  object: Record<string, string>,
  keyPath: string
) => {
  const keys = keyPath.split(".");
  let value = object as any;
  for (const key of keys) {
    value = value?.[key];
    if (!value) {
      return "";
    }
  }
  return value;
};

const KeyValue = ({
  label,
  value,
  formatter,
}: {
  label: string;
  value: string;
  formatter?: (value: string) => string | JSX.Element;
}) => {
  return (
    <tr className="even:bg-muted">
      <td className="text-sm text-muted-foreground p-2 border-0 rounded-tl rounded-bl">
        {label}
      </td>
      <td className="text-sm p-2 border-0 rounded-tr rounded-br">
        {formatter ? formatter(value) : value}
      </td>
    </tr>
  );
};

const KeyValueList = ({ title, data, keys }: KeyValueListProps) => {
  return (
    <div className="flex flex-col">
      {title && <h1 className="font-semibold text-lg mb-3 mt-2">{title}</h1>}
      <table className="w-full">
        <tbody className="w-full">
          {keys
            ? keys.map((key) => {
                if (typeof key === "string") {
                  return <KeyValue key={key} label={key} value={data[key]} />;
                } else {
                  return (
                    <KeyValue
                      key={key.key}
                      label={key.label || key.key}
                      formatter={key.formatter}
                      value={extractValueFromObject(data, key.key)}
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
};

export default KeyValueList;
