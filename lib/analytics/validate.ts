import { z } from 'zod';

export const inquiryCreateSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email().max(320),
  phone: z.string().max(40).optional(),
  message: z.string().min(1).max(8000),
});

export const pageViewSchema = z.object({
  path: z.string().min(1).max(500),
});
