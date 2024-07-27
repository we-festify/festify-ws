import { z } from 'zod';

export const rootUserLoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
});

export const aimUserLoginSchema = z.object({
  accountId: z.string().min(24, 'Invalid account id'),
  alias: z.string().min(3, 'Alias must be at least 3 characters long'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
});
