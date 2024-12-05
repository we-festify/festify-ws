import { PermissionPolicyAction } from '@sharedtypes/aim/permission-policy';

export const besActions: {
  description?: string;
  alias: PermissionPolicyAction;
}[] = [
  {
    alias: 'bes:ListInstances',
    description: 'Grants permission to list email service instances',
  },
  {
    alias: 'bes:CreateInstance',
    description: 'Grants permission to create an email service instance',
  },
  {
    alias: 'bes:ReadInstance',
    description: 'Grants permission to read an email service instance',
  },
  {
    alias: 'bes:UpdateInstance',
    description: 'Grants permission to update an email service instance',
  },
  {
    alias: 'bes:DeleteInstances',
    description:
      'Grants permission to delete email service instances with specified frn(s)',
  },
  {
    alias: 'bes:ListEmailTemplates',
    description: 'Grants permission to list email templates',
  },
  {
    alias: 'bes:CreateEmailTemplate',
    description: 'Grants permission to create an email template',
  },
  {
    alias: 'bes:ReadEmailTemplate',
    description: 'Grants permission to read an email template',
  },
  {
    alias: 'bes:UpdateEmailTemplate',
    description: 'Grants permission to update an email template',
  },
  {
    alias: 'bes:DeleteEmailTemplates',
    description:
      'Grants permission to delete email templates with specified frn(s)',
  },
];
