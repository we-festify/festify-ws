import { MultiStepFormStep } from '@sharedui/components/multi-step-form';
import EmailCredentials from '../../../../components/instances/instance-form-steps/email-credentials';
import InstanceDetails from '../../../../components/instances/instance-form-steps/instance-details';
import ReviewAndCreate from '../../../../components/instances/instance-form-steps/review-and-create';
import SMTPSettings from '../../../../components/instances/instance-form-steps/smtp-settings';

export const stepsForCreatingInstance: MultiStepFormStep[] = [
  {
    title: 'Instance details',
    component: <InstanceDetails />,
    validateNext: (form) => form.trigger(['alias']),
  },
  {
    title: 'Email credentials',
    component: <EmailCredentials />,
    validateNext: (form) => form.trigger(['senderName', 'senderEmail']),
  },
  {
    title: 'SMTP settings',
    component: <SMTPSettings />,
    validateNext: (form) =>
      form.trigger(['smtpUser', 'smtpPassword', 'smtpHost', 'smtpPort']),
  },
  {
    title: 'Review and create',
    component: <ReviewAndCreate />,
  },
];
