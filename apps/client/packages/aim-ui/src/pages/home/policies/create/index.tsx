import MultiStepForm from '@sharedui/components/multi-step-form';
import { createPolicySchema, defaultValues } from './schema';
import { stepsForCreatingPolicy } from './steps';
import { getErrorMessage } from '@sharedui/utils/error';
import { toast } from 'sonner';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { aimPaths } from '@sharedui/constants/paths';
import { useCreatePolicyMutation } from '@aim-ui/api/policies';

const CreatePolicyPage = () => {
  const [createPolicy] = useCreatePolicyMutation();
  const navigate = useNavigate();

  const handleCreatePolicy = async (
    values: z.infer<typeof createPolicySchema>,
  ) => {
    try {
      const modifiedValues = {
        ...values,
        rules: values.rules.map((rule) => ({
          ...rule,
          service: undefined,
        })),
      };
      const payload = await createPolicy(modifiedValues).unwrap();
      toast.success(payload.message || 'Policy created successfully');
      navigate(aimPaths.POLICIES, { replace: true });
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <MultiStepForm
      title="Create policy"
      description="A policy is an object in FWS that defines permissions."
      className="mx-auto p-6"
      schema={createPolicySchema}
      defaultValues={defaultValues}
      steps={stepsForCreatingPolicy}
      submitButtonText="Create policy"
      onSubmit={handleCreatePolicy}
      onCancel={() => navigate(aimPaths.POLICIES, { replace: true })}
    />
  );
};

export default CreatePolicyPage;
