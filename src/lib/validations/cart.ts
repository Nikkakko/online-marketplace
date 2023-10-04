import * as z from 'zod';
import { $Enums } from '@prisma/client';

export const cartItemSchema = z.object({
  productId: z.number(),
  quantity: z.number().min(0),
  subcategory: z.string().optional().nullable(),
});

export const cartLineItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  price: z.number(),
  images: z.array(z.string()),
  description: z.string(),
  category: z.string(z.nativeEnum($Enums.Category)),
  quantity: z.number().min(0),
});
