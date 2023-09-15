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
  rating: z.number(),
  quantity: z.number().min(0),
});
// id: string;
// userId: string;
// title: string;
// description: string;
// images: string[];
// category: $Enums.Category;
// seller: string;
// price: number;
// quantity: number;
// rating: number;
// cartId: string | null;
// orderId: string | null;
// createdAt: Date;
// updatedAt: Date;
