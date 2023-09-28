'use server';
import {
  addProductsSchema,
  getProductsSchema,
  reviewProductSchema,
} from '@/lib/validations/product';
import { $Enums, Products } from '@prisma/client';
import { type z } from 'zod';
import db from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { revalidatePath } from 'next/cache';
import { getUserEmail } from '@/lib/utils';
import { checkSubscription } from '@/lib/subscription';
import { checkProductLimitCount, increaseCount } from '@/lib/limit-count';
import { NextResponse } from 'next/server';

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

export async function addProductsAction(
  input: z.infer<typeof addProductsSchema>,
  images:
    | {
        id: string;
        url: string;
        name: string;
      }[]
    | null
) {
  const { title, description, price, category } = input;
  const { userId, user } = auth();
  const sellerEmail = getUserEmail(user);
  const getImages = images?.map(image => image.url);

  const priceToNumber = Number(price);

  const isPro = await checkSubscription();
  const freeTrial = await checkProductLimitCount();

  if (!freeTrial && !isPro) {
    return new NextResponse('Free trial limit reached', { status: 403 });
  }

  const product = await db.products.create({
    data: {
      title: title,
      description: description,
      quantity: 1,
      rating: 0,
      seller: sellerEmail.toLowerCase().split('@')[0],
      price: priceToNumber,
      category: category,
      images: getImages,
      userId: userId as string,
    },
  });

  revalidatePath('/');
  return {
    product: product,
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

export async function deleteProductAction(productId: string) {
  const { userId } = auth();

  const product = await db.products.findUnique({
    where: {
      id: productId,
    },
  });

  if (product?.userId !== userId) {
    throw new Error('You are not authorized to delete this product');
  }

  await db.products.delete({
    where: {
      id: productId,
    },
  });

  revalidatePath('/');
}

export async function updateProductAction(
  productId: string | undefined,
  input: {
    title: string;
    description: string;
    price: number;
    category: Products['category'];
    images: string[];
  }
) {
  const { userId } = auth();

  const product = await db.products.findUnique({
    where: {
      id: productId,
    },
  });

  if (product?.userId !== userId) {
    throw new Error('You are not authorized to update this product');
  }

  await db.products.update({
    where: {
      id: productId,
    },
    data: input,
  });

  revalidatePath('/');
}
