'use server';
import {
  addProductsSchema,
  getProductsSchema,
  reviewProductSchema,
} from '@/lib/validations/product';
import { $Enums, Products } from '@prisma/client';
import { type z } from 'zod';
import db from '@/lib/db';
import { auth, currentUser } from '@clerk/nextjs';
import { revalidatePath } from 'next/cache';
import { checkSubscription } from '@/lib/subscription';
import { checkProductLimitCount, increaseCount } from '@/lib/limit-count';
import { NextResponse } from 'next/server';

export async function getProductsAction(
  input: z.infer<typeof getProductsSchema>
) {
  const { limit, offset, categories, sort, price, subcategories } = input;

  const sortKey = sort?.split('.')[0] as string;
  const sortDirection = sort?.split('.')[1] as 'asc' | 'desc';

  const products = await db.products.findMany({
    skip: offset,
    take: limit,

    where: {
      category: {
        equals: categories as $Enums.Category,
      },

      subcategory: {
        equals: subcategories as string,
      },
    },

    orderBy: {
      [sortKey]: sortDirection,
    },
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
  const { title, description, price, category, subcategory } = input;

  const user = await currentUser();
  const getImages = images?.map(image => image.url);

  const priceToNumber = Number(price);

  const isPro = await checkSubscription();
  const freeTrial = await checkProductLimitCount();

  if (!freeTrial && !isPro) {
    throw new Error('You have reached your free trial limit, please upgrade');
  }

  const product = await db.products.create({
    data: {
      title: title,
      description: description,
      quantity: 1,
      seller: user?.emailAddresses?.[0].emailAddress.split('@')[0] as string,
      price: priceToNumber,
      category: category,
      images: getImages,
      userId: user?.id as string,
      subcategory: subcategory,
    },
  });

  if (!isPro) {
    await increaseCount();
  }

  revalidatePath('/');

  return {
    product: product,
  };
}

export async function addReviewToProductAction(
  input: z.infer<typeof reviewProductSchema>,
  productId: string
) {
  const { title, description } = input;
  const { userId } = auth();

  const review = await db.review.create({
    data: {
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

  const productImages = product?.images;

  await db.products.update({
    where: {
      id: productId,
    },
    data: {
      title: input.title,
      description: input.description,
      price: input.price,
      category: input.category,
      images: [...productImages, ...input.images],
    },
  });

  revalidatePath('/');
}

export async function removeImagesAction(
  productId: string | undefined,
  images: string[]
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
    data: {
      images: images,
    },
  });

  revalidatePath('/');
}

export async function filterProductsAction(query: string) {
  if (query.length === 0) return null;

  const products = await db.products.findMany({
    where: {
      title: {
        contains: query,
        mode: 'insensitive',
      },
    },

    orderBy: {
      createdAt: 'desc',
    },

    select: {
      category: true,
      title: true,
      id: true,
    },

    take: 10,
  });

  return products;
}
