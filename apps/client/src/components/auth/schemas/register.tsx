import { z } from 'zod';

export const rootUserRegisterSchema = z.object({
  alias: z
    .string()
    .min(3, 'Alias must be at least 3 characters long')
    .max(20, 'Alias must be at most 20 characters long')
    .regex(
      /^[a-z0-9_-]+$/,
      'Only lowercase letters, numbers, hyphens, and underscores are allowed'
    ),
  email: z.string().email('Invalid email address'),
});
