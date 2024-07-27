import { MultiStepFormStep } from '../../../../../shared/components/MultiStepForm';
import EmailCredentials from '../../../../components/instances/InstanceFormSteps/EmailCredentials';
import InstanceDetails from '../../../../components/instances/InstanceFormSteps/InstanceDetails';
import ReviewAndCreate from '../../../../components/instances/InstanceFormSteps/ReviewAndCreate';
import SMTPSettings from '../../../../components/instances/InstanceFormSteps/SMTPSettings';

export const stepsForCreatingInstance: MultiStepFormStep[] = [
  {
    title: 'Instance details',
    component: <InstanceDetails />,
    validateNext: (form) => form.trigger(['alias']),
  },
  {
    title: 'Email credentials',
    component: <EmailCredentials />,
    validateNext: (form) =>
      form.trigger(['senderName', 'senderEmail', 'senderPassword']),
  },
  {
    title: 'SMTP settings',
    component: <SMTPSettings />,
    validateNext: (form) => form.trigger(['smtpHost', 'smtpPort']),
  },
  {
    title: 'Review and create',
    component: <ReviewAndCreate />,
  },
];
