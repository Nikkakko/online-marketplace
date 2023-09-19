'use server';
import {
  getProductsSchema,
  reviewProductSchema,
} from '@/lib/validations/product';
import { $Enums } from '@prisma/client';
import { type z } from 'zod';
import db from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { revalidatePath } from 'next/cache';

export async function getProductsAction(
  input: z.infer<typeof getProductsSchema>
) {
  const { limit, offset, categories, sort, price } = input;

  const products = await db.products.findMany({
    skip: offset,
    take: limit,

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

export async function addReviewToProductAction(
  input: z.infer<typeof reviewProductSchema>,
  productId: string
) {
  const { rating, title, description } = input;
  const { userId } = auth();

  const review = await db.review.create({
    data: {
      rating: rating,
      title: title,
      description: description,
      userId: userId as string,
      productId: productId,
    },
  });

  revalidatePath('/');
  return {
    review: review,
  };
}

export async function deleteReviewAction(reviewId: string) {
  const { userId } = auth();

  const review = await db.review.findUnique({
    where: {
      id: reviewId,
    },
  });

  if (review?.userId !== userId) {
    throw new Error('You are not authorized to delete this review');
  }

  await db.review.delete({
    where: {
      id: reviewId,
    },
  });

  revalidatePath('/');
}
