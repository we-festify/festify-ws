import {
  Table as BaseTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';

interface TableProps {
  cols: {
    key: string;
    title: string;
  }[];
  data: any[];
  title?: string;
}

const Table = ({ cols, data, title }: TableProps) => {
  return (
    <>
      {title && <h3 className="font-semibold">{title}</h3>}
      <BaseTable>
        <TableHeader>
          <TableRow>
            {cols.map((col, index) => (
              <TableHead key={`${col.key}-${index}`}>{col.title}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row: any, index: number) => (
            <TableRow key={index}>
              {cols.map((col, idx) => (
                <TableCell key={`${col.key}-${idx}`}>
                  {typeof row[col.key] === 'boolean'
                    ? row[col.key]
                      ? 'Yes'
                      : ''
                    : row[col.key]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </BaseTable>
    </>
  );
};

export default Table;
