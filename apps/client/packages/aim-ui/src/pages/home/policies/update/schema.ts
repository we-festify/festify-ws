import { z } from 'zod';

const policyRuleSchema = z.object({
  service: z.any(), // only for frontend logic of selecting services
  effect: z.enum(['allow', 'deny']),
  actions: z.array(z.string()).min(1, "Actions can't be empty"),
  resources: z.array(z.string()),
});

export const updatePolicySchema = z.object({
  alias: z
    .string()
    .min(3, 'Alias must be at least 3 characters')
    .max(50, 'Alias must be at most 50 characters')
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      'Alias can only contain letters, numbers, - and _',
    ),
  description: z
    .string()
    .min(3, 'Description must be at least 3 characters')
    .max(100, 'Description must be at most 100 characters'),
  rules: z.array(policyRuleSchema).min(1, 'Rules can not be empty'),
});
