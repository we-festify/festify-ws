import { useParams } from 'react-router-dom';
import MultiStepForm from '@sharedui/components/MultiStepForm';
import { updateInstanceSchema } from './schema';
import { stepsForCreatingInstance } from './steps';
import {
  useGetBESInstanceByAliasQuery,
  useUpdateBESInstanceMutation,
} from '../../../../api/instances';
import { toast } from 'sonner';
import { getErrorMessage } from '@sharedui/utils/error';
import { z } from 'zod';
import { BESInstanceType } from '@sharedtypes/bes';

const UpdateInstancePage = () => {
  const { alias = '' } = useParams<{ alias: string }>();
  const { data: { instance } = {} } = useGetBESInstanceByAliasQuery<{
    data: { instance: BESInstanceType };
  }>(alias, {
    skip: !alias,
  });
  const [updateInstance] = useUpdateBESInstanceMutation();

  const handleUpdateInstance = async (
    values: z.infer<typeof updateInstanceSchema>
  ) => {
    if (!instance) return;

    try {
      const payload = await updateInstance({
        instanceId: instance._id,
        instance: values,
      }).unwrap();
      toast.success(payload.message || 'Instance updated successfully');
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <MultiStepForm
      title="Update instance"
      description="An instance contains all the settings and credentials required to send emails through the Festify BES. You can create multiple instances to send emails from different email addresses."
      className="mx-auto p-6"
      schema={updateInstanceSchema}
      defaultValues={instance}
      steps={stepsForCreatingInstance}
      submitButtonText="Update instance"
      onSubmit={handleUpdateInstance}
    />
  );
};

export default UpdateInstancePage;
