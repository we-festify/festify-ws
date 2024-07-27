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
  body: z
    .string()
    .min(10, 'Body must be at least 10 characters')
    .max(1000, 'Body must be at most 1000 characters'),
});
