import { useGetInstanceQuery } from '../../../api/instances';
import KeyValueList from '../../shared/components/custom/KeyValueList';
import { formatDateTime, formatTimeFromNow } from '../../shared/utils/time';

interface InstanceUsageDetailsProps {
  serviceType: string;
  instanceId: string;
}

const usageKeys = [
  {
    key: 'apiCalls',
    label: 'API Calls',
    formatter: (value: number) => value.toString() || '0',
  },
  {
    key: 'lastApiCallTime',
    label: 'Last Used',
    formatter: (value: string) => formatTimeFromNow(value) || 'Never',
  },
  {
    key: 'lastApiCallReset',
    label: 'Last Refresh Date',
    formatter: (value: string) => formatDateTime(value) || 'N/A',
  },
];

const InstanceUsageDetails = ({
  serviceType,
  instanceId,
}: InstanceUsageDetailsProps) => {
  const { data: { instance } = {} } = useGetInstanceQuery({
    serviceType: serviceType as string,
    instanceId: instanceId as string,
  });

  return (
    <div className="flex flex-col gap-2">
      <KeyValueList title="Usage" data={instance} keys={usageKeys} />
    </div>
  );
};

export default InstanceUsageDetails;
