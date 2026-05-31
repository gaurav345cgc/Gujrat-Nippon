import { z } from 'zod';

export const inquiryCreateSchema = z.object({
  name: z.string().min(1).max(200),
  company: z.string().max(200).optional(),
  email: z.string().email().max(320),
  phone: z.string().max(40).optional(),
  subject: z.string().min(1).max(200),
  message: z.string().min(1).max(8000),
  source: z.enum(['contact', 'chatbot']).default('contact'),
  website: z.string().max(0).optional(),
});

export const pageViewSchema = z.object({
  path: z.string().min(1).max(500),
});
