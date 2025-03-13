import { useReadSummaryQuery } from '@methods-ui/api/handlers';
import KeyValueGrid, {
  KeyValueType,
} from '@sharedui/components/key-value-grid';
import { Card, CardContent, CardHeader } from '@sharedui/primitives/card';

export const SummaryCard = () => {
  const { data: { summary } = {} } = useReadSummaryQuery();

  return (
    <Card>
      <CardHeader variant="muted">
        <h2 className="text-lg font-semibold">Summary</h2>
      </CardHeader>
      <CardContent>
        <KeyValueGrid colsCount={3} data={summary ?? {}} keys={summaryKeys} />
      </CardContent>
    </Card>
  );
};

const summaryKeys: KeyValueType[] = [
  { key: 'count', label: 'Handlers Count' },
  { key: 'total.codeSize', label: 'Total Code Size' },
  { key: 'total.memory', label: 'Total Memory' },
  { key: 'avg.codeSize', label: 'Average Code Size' },
  { key: 'avg.memory', label: 'Average Memory' },
  { key: 'avg.timeout', label: 'Average Timeout' },
];
