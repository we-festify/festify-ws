import MultiStepForm from '@sharedui/components/multi-step-form';
import { updatePolicySchema } from './schema';
import { stepsForCreatingPolicy } from './steps';
import { getErrorMessage } from '@sharedui/utils/error';
import { toast } from 'sonner';
import { z } from 'zod';
import { useNavigate, useParams } from 'react-router-dom';
import { aimPaths } from '@sharedui/constants/paths';
import {
  useGetPolicyByIdQuery,
  useUpdatePolicyMutation,
} from '@aim-ui/api/policies';

const UpdatePolicyPage = () => {
  const { policyId } = useParams<{ policyId: string }>();
  const { data: { policy } = {} } = useGetPolicyByIdQuery(policyId as string);
  const [updatePolicy] = useUpdatePolicyMutation();
  const navigate = useNavigate();

  const handleUpdatePolicy = async (
    values: z.infer<typeof updatePolicySchema>,
  ) => {
    try {
      const modifiedValues = {
        ...values,
        rules: values.rules.map((rule) => ({
          ...rule,
          service: undefined,
        })),
      };
      if (!policyId) return;
      const payload = await updatePolicy({
        policyId,
        policy: modifiedValues,
      }).unwrap();
      toast.success(payload.message || 'Policy updated successfully');
      navigate(aimPaths.POLICIES, { replace: true });
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <MultiStepForm
      title="Update policy"
      description="A policy is an object in FWS that defines permissions."
      className="mx-auto p-6"
      schema={updatePolicySchema}
      defaultValues={{
        ...policy,
        rules: policy?.rules?.map((rule) => {
          console.log(rule.actions[0].split(':')[0]);
          return {
            ...rule,
            service: rule.actions[0].split(':')[0],
          };
        }),
      }}
      steps={stepsForCreatingPolicy}
      submitButtonText="Update policy"
      onSubmit={handleUpdatePolicy}
      onCancel={() => navigate(aimPaths.POLICIES, { replace: true })}
    />
  );
};

export default UpdatePolicyPage;
