'use server';
import { getProductsSchema } from '@/lib/validations/product';
import { $Enums } from '@prisma/client';
import { type z } from 'zod';
import db from '@/lib/db';

export async function getProductsAction(
  input: z.infer<typeof getProductsSchema>
) {
  const { limit, offset, categories, sort, price } = input;

  const products = await db.products.findMany({
    take: limit,
    skip: offset,

    where: {
      category: {
        equals: categories as $Enums.Category,
      },
    },

    orderBy: [
      {
        createdAt: sort === 'createdAt.asc' ? 'asc' : 'desc',
      },
      {
        price: sort === 'price.asc' ? 'asc' : 'desc',
      },

      {
        rating: sort === 'rating.asc' ? 'asc' : 'desc',
      },
    ],
  });

  const count = await db.products.count({
    where: {
      category: {
        equals: categories as $Enums.Category,
      },
    },
  });

  return {
    products: products,
    count: count,
  };
}
