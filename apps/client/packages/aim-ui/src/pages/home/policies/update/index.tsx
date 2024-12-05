import MultiStepForm from '@sharedui/components/multi-step-form';
import { updatePolicySchema } from './schema';
import { stepsForCreatingPolicy } from './steps';
import { getErrorMessage } from '@sharedui/utils/error';
import { toast } from 'sonner';
import { z } from 'zod';
import { useNavigate, useParams } from 'react-router-dom';
import { aimPaths } from '@sharedui/constants/paths';
import {
  useReadPolicyQuery,
  useUpdatePolicyMutation,
} from '@aim-ui/api/policies';
import { generateFRN } from '@sharedui/utils/frn';
import { useAuth } from '@rootui/providers/auth-provider';
import { PermissionPolicyAction } from '@sharedtypes/aim/permission-policy';

const UpdatePolicyPage = () => {
  const { alias } = useParams<{ alias: string }>();
  const { user } = useAuth();
  const policyFrn = generateFRN(
    'aim',
    user?.accountId ?? '',
    'policy',
    alias ?? '',
  );
  const { data: { policy } = {} } = useReadPolicyQuery(policyFrn);
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
          actions: rule.actions as PermissionPolicyAction[],
        })),
      };
      await updatePolicy({
        frn: policyFrn,
        policy: modifiedValues,
      }).unwrap();
      toast.success('Policy updated successfully');
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
