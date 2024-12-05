import PolicyDetails from '@aim-ui/components/policies/policy-form-steps/policy-details';
import ReviewAndCreate from '@aim-ui/components/policies/policy-form-steps/review-and-create';
import SpecifyPermissions from '@aim-ui/components/policies/policy-form-steps/specify-permissions';
import { MultiStepFormStep } from '@sharedui/components/multi-step-form';

export const createPolicySteps: MultiStepFormStep[] = [
  {
    title: 'Policy details',
    component: <PolicyDetails />,
    validateNext: (form) => form.trigger(['alias', 'description']),
  },
  {
    title: 'Specify permissions',
    component: <SpecifyPermissions />,
    validateNext: (form) => form.trigger(['rules']),
  },
  {
    title: 'Review and create',
    component: <ReviewAndCreate />,
  },
];
