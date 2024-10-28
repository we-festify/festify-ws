import { z } from 'zod';

export const createUserSchema = z.object({
  alias: z
    .string()
    .min(3, 'Alias must be at least 3 characters')
    .max(50, 'Alias must be at most 50 characters')
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      'Alias can only contain letters, numbers, - and _',
    ),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const defaultValues = {
  alias: '',
  password: '',
};
