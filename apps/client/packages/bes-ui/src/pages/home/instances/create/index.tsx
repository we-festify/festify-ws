import { useCreateBESInstanceMutation } from '../../../../api/instances';
import MultiStepForm from '@sharedui/components/multi-step-form';
import { createInstanceSchema, defaultValues } from './schema';
import { stepsForCreatingInstance } from './steps';
import { getErrorMessage } from '@sharedui/utils/error';
import { toast } from 'sonner';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { besPaths } from '@sharedui/constants/paths';

const CreateInstancePage = () => {
  const [createInstance] = useCreateBESInstanceMutation();
  const navigate = useNavigate();

  const handleCreateInstance = async (
    values: z.infer<typeof createInstanceSchema>,
  ) => {
    try {
      const payload = await createInstance(values).unwrap();
      toast.success(payload.message || 'Instance created successfully');
      navigate(besPaths.INSTANCES, { replace: true });
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <MultiStepForm
      title="Create instance"
      description="An instance contains all the settings and credentials required to send emails through the Festify BES. You can create multiple instances to send emails from different email addresses."
      className="mx-auto p-6"
      schema={createInstanceSchema}
      defaultValues={defaultValues}
      steps={stepsForCreatingInstance}
      submitButtonText="Create instance"
      onSubmit={handleCreateInstance}
      onCancel={() => navigate(besPaths.INSTANCES, { replace: true })}
    />
  );
};

export default CreateInstancePage;
