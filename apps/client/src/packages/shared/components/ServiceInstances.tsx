import { useGetInstancesQuery } from '../../../api/instances';
import EmptyInbox from '../../../assets/images/EmptyInbox.svg';
import { NewInstanceDialog } from './NewInstanceDialog';
import InstancesTable from './InstancesTable';
import { Button } from '../ui/button';

interface ServiceInstancesProps {
  type: string;
}

const ServiceInstances = ({ type }: ServiceInstancesProps) => {
  const { data: { instances = [] } = {} } = useGetInstancesQuery(type);

  return (
    <div>
      {instances.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4">
          <img src={EmptyInbox} alt="Empty Inbox" className="h-1/2" />
          <p className="text-lg font-semibold text-center">
            No instances created yet
          </p>
          <NewInstanceDialog
            type={type}
            trigger={<Button>Create Instance</Button>}
          />
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <InstancesTable type={type} instances={instances} />
          <div className="flex flex-row-reverse">
            <NewInstanceDialog
              type={type}
              trigger={<Button>Create Instance</Button>}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceInstances;
