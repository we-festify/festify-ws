import { z } from 'zod';

export const updateInstanceSchema = z.object({
  // instance details
  alias: z
    .string()
    .min(3, 'Alias must be at least 3 characters')
    .max(50, 'Alias must be at most 50 characters')
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      'Alias can only contain letters, numbers, - and _'
    ),
  // sender details
  senderName: z
    .string()
    .min(3, 'Sender name must be at least 3 characters')
    .max(50, 'Sender name must be at most 50 characters'),
  senderEmail: z.string().email('Invalid email address'),
  senderPassword: z.string().min(1, 'Password is required'),
  // smtp details
  smtpHost: z.string().optional(),
  smtpPort: z.number().optional(),
});

export const defaultValues = {
  alias: 'test-instance',

  senderName: 'Test Sender',
  senderEmail: 'test@example.com',
  senderPassword: 'password',

  smtpHost: 'smtp.ethereal.email',
  smtpPort: 587,
};
