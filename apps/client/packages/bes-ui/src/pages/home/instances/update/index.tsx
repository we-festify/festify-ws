import { useNavigate, useParams } from 'react-router-dom';
import MultiStepForm from '@sharedui/components/multi-step-form';
import { updateInstanceSchema } from './schema';
import { stepsForCreatingInstance } from './steps';
import {
  useReadInstanceQuery,
  useUpdateInstanceMutation,
} from '../../../../api/instances';
import { toast } from 'sonner';
import { getErrorMessage } from '@sharedui/utils/error';
import { z } from 'zod';
import { IBESInstance } from '@sharedtypes/bes';
import { useAuth } from '@rootui/providers/auth-provider';
import { generateFRN } from '@sharedui/utils/frn';
import { besPaths } from '@sharedui/constants/paths';

const UpdateInstancePage = () => {
  const { alias = '' } = useParams<{ alias: string }>();
  const { user } = useAuth();
  const frn = generateFRN('bes', user?.accountId ?? '', 'instance', alias);
  const { data: { instance } = {} } = useReadInstanceQuery<{
    data: { instance: IBESInstance };
  }>(frn, {
    skip: !alias,
  });
  const [updateInstance] = useUpdateInstanceMutation();
  const navigate = useNavigate();

  const handleUpdateInstance = async (
    values: z.infer<typeof updateInstanceSchema>,
  ) => {
    if (!instance) return;

    try {
      await updateInstance({
        frn,
        instance: values,
      }).unwrap();
      toast.success('Instance updated successfully');
      navigate(besPaths.INSTANCES);
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
