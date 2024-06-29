import { useGetInstanceQuery } from '../../../api/instances';
import CopyIcon from '../../shared/components/custom/CopyIcon';
import KeyValueList from '../../shared/components/custom/KeyValueList';
import { formatTimeFromNow } from '../../shared/utils/time';
import { useParams } from 'react-router-dom';
import InstanceCredsDetails from './InstanceCredsDetails';
import InstanceUsageDetails from './InstanceUsageDetails';
import { UpdateInstanceDialog } from '../../shared/components/UpdateInstanceDialog';
import { Button } from '../../shared/ui/button';

interface InstanceDetailsProps {
  serviceType: string;
}

const InstanceDetails = ({ serviceType }: InstanceDetailsProps) => {
  const params = useParams();
  const { instanceId } = params;

  const { data: { instance } = {} } = useGetInstanceQuery({
    serviceType: serviceType as string,
    instanceId: instanceId as string,
  });

  return (
    <div className="flex flex-col gap-2 pb-4">
      <KeyValueList title="Basic" data={instance} keys={detailKeys} />
      <div className="flex flex-row-reverse mt-2">
        <UpdateInstanceDialog
          type={serviceType as string}
          trigger={<Button>Update Instance</Button>}
          instanceId={instance?._id}
          defaultValue={instance}
        />
      </div>
      <InstanceUsageDetails
        serviceType={serviceType as string}
        instanceId={instanceId as string}
      />
      <InstanceCredsDetails
        type={serviceType as string}
        creds={instance?.creds}
      />
    </div>
  );
};

const detailKeys = [
  { key: '_id', label: 'Instance Id' },
  {
    key: 'apiKey',
    label: 'API Key',
    formatter: (value: string) => {
      return (
        <span className="text-muted-foreground flex items-center justify-between">
          <span>
            {value.slice(0, 5)}
            **********
            {value.slice(-4)}
          </span>
          <CopyIcon value={value} className="h-5 p-1" />
        </span>
      );
    },
  },
  { key: 'name', label: 'Name' },
  {
    key: 'service.type',
    label: 'Service Type',
    formatter: (value: string) => value.toUpperCase(),
  },
  {
    key: 'createdAt',
    label: 'Created',
    formatter: (value: string) => {
      return formatTimeFromNow(value);
    },
  },
  {
    key: 'updatedAt',
    label: 'Updated',
    formatter: (value: string) => {
      return formatTimeFromNow(value);
    },
  },
  {
    key: 'status',
    label: 'Status',
    formatter: (value: string) => {
      return value === 'active' ? (
        <span className="text-blue-600">Active</span>
      ) : (
        <span className="text-orange-400 capitalize">{value}</span>
      );
    },
  },
  {
    key: 'allowedOrigins',
    label: 'Allowed Origins',
    formatter: (value: string[]) => {
      if (!value) return 'None';
      return value?.join(', ') || 'None';
    },
  },
];

export default InstanceDetails;
