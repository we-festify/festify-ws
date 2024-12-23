import { z } from 'zod';

export const updateEmailTemplateSchema = z.object({
  name: z
    .string()
    .min(3, 'Name must be at least 3 characters')
    .max(50, 'Name must be at most 50 characters'),
  subject: z
    .string()
    .min(3, 'Subject must be at least 3 characters')
    .max(100, 'Subject must be at most 100 characters'),
  text: z
    .string()
    .max(1000, 'Body text must be at most 1000 characters')
    .optional(),
  html: z
    .string()
    .max(10000, 'Body HTML must be at most 10000 characters')
    .optional(),
});
