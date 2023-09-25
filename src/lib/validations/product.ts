import * as z from 'zod';
import { Category } from '@prisma/client';

export const getProductsSchema = z.object({
  limit: z.number().default(10),
  offset: z.number().default(0),
  categories: z
    .string()
    .regex(/^\d+.\d+$/)
    .optional()
    .nullable(),
  sort: z
    .string()
    .regex(/^(asc|desc)$/)
    .optional()
    .nullable(),

  price: z
    .string()
    .regex(/^(asc|desc)$/)
    .optional()
    .nullable(),
});

export const reviewProductSchema = z.object({
  rating: z.number().min(1).max(5),
  title: z
    .string({
      required_error: 'Please enter a title for your review',
    })
    .min(3, {
      message: 'Title must be at least 3 characters long',
    })
    .max(100)
    .regex(/^[a-zA-Z0-9 ]+$/, {
      message: 'Title must only contain letters, numbers and spaces',
    }),

  description: z
    .string()
    .min(10, {
      message: 'Description must be at least 10 characters long',
    })
    .max(500),
});

export const addProductsSchema = z.object({
  title: z
    .string({
      required_error: 'Please enter a title for your product',
    })
    .min(3, {
      message: 'Title must be at least 3 characters long',
    })
    .max(100)
    .regex(/^[a-zA-Z0-9 ]+$/, {
      message: 'Title must only contain letters, numbers and spaces',
    }),

  description: z
    .string()
    .min(10, {
      message: 'Description must be at least 10 characters long',
    })
    .max(500),

  images: z.array(z.string().url()),

  price: z.string().regex(/^\d+(\.\d{1,2})?$/, {
    message: 'Must be a valid price',
  }),

  category: z.nativeEnum(Category),
});
