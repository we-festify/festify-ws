import { useUpdateInstanceMutation } from '../../../../../api/instances';
import { Button } from '../../../../ui/button';
import { Input } from '../../../../ui/input';
import { Label } from '../../../../ui/label';
import { RadioGroup, RadioGroupItem } from '../../../../ui/radio-group';
import { Textarea } from '../../../../ui/textarea';
import { toast } from 'sonner';

const UpdateBESInstanceDialogContent = ({
  instanceId,
  defaultValue,
}: {
  instanceId: string;
  defaultValue: any;
}) => {
  const [updateInstance, { isLoading }] = useUpdateInstanceMutation();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const instanceName = formData.get('instance-name') as string;
    const status = formData.get('instance-status') as string;
    const allowedOrigins = formData.get('allowed-origins') as string;

    try {
      const payload = await updateInstance({
        serviceType: 'bes',
        instanceId: instanceId,
        data: {
          name: instanceName,
          status: status,
          allowedOrigins: allowedOrigins
            .split(',')
            .map((origin) => origin.trim()),
        },
      }).unwrap();
      toast.success(payload.message);
    } catch (error: any) {
      toast.error(error.data.message);
    }
  };

  return (
    <form className="grid gap-6" onSubmit={handleSubmit}>
      <div className="grid gap-2">
        <Label htmlFor="instance-name">Name</Label>
        <Input
          id="instance-name"
          name="instance-name"
          type="text"
          placeholder="Project 1"
          required
          defaultValue={defaultValue?.name}
        />
      </div>
      <div className="grid gap-4">
        <Label htmlFor="instance-status">Status</Label>
        <RadioGroup
          className="flex gap-4"
          id="instance-status"
          name="instance-status"
          required
          defaultValue={defaultValue?.status}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="active" id="r1" />
            <Label htmlFor="r1">Active</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="inactive" id="r2" />
            <Label htmlFor="r2">Inactive</Label>
          </div>
        </RadioGroup>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="allowed-origins">Allowed Origins</Label>
        <Textarea
          id="allowed-origins"
          name="allowed-origins"
          placeholder="https://example.com, https://example2.com"
          defaultValue={defaultValue?.allowedOrigins.join(', ')}
        />
      </div>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Updating...' : 'Update'}
      </Button>
    </form>
  );
};

export default UpdateBESInstanceDialogContent;
