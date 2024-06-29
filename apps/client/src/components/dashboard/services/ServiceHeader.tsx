import { getErrorMessage } from '../../../packages/shared/utils/error';
import {
  useEnableServiceMutation,
  useGetServiceMetaByTypeQuery,
} from '../../../api/services';
import { Button } from '../../../packages/shared/ui/button';
import { toast } from 'sonner';

interface ServiceHeaderProps {
  type: string;
}

const ServiceHeader = ({ type }: ServiceHeaderProps) => {
  const { data: { service = {} } = {} } = useGetServiceMetaByTypeQuery(type);
  const [enableService, { isLoading }] = useEnableServiceMutation();

  const handleEnableService = async () => {
    try {
      const payload = await enableService(type).unwrap();
      toast.success(payload.message);
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      toast.error(message);
    }
  };

  return (
    <div className="flex w-full gap-6 pb-8 md:pt-0 lg:pt-4">
      <div className="flex flex-1 flex-col gap-2">
        <h1 className="text-2xl font-semibold">{service.fullName}</h1>
        <p className="text-muted-foreground text-sm">{service.summary}</p>
      </div>
      {!service.enabled ? (
        <Button
          className="w-32 mt-4"
          onClick={handleEnableService}
          disabled={isLoading}
        >
          {isLoading ? 'Enabling...' : 'Enable'}
        </Button>
      ) : (
        <p className="text-green-600 font-semibold">Enabled</p>
      )}
    </div>
  );
};

export default ServiceHeader;
