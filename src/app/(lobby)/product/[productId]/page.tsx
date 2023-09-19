import React from 'react';
import db from '@/lib/db';
import { notFound } from 'next/navigation';
import { Shell } from '@/components/shell/shell';
import { BreadCrumbs } from '@/components/BreadCrumbs';
import { formatPrice, toTitleCase } from '@/lib/utils';
import { ProductImageCarousel } from '@/components/ProductImageCarousel';
import { Separator } from '@/components/ui/separator';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

import AddToCartForm from '@/components/AddToCartForm';
import { ProductCard } from '@/components/cards/product-card';
import ReviewCard from '@/components/cards/ReviewCard';
import ReviewForm from '@/components/forms/review-form';

interface Props {
  params: {
    productId: string;
  };
}

const ProductDetail = async ({ params }: Props) => {
  const { productId } = params;

  const product = await db.products.findUnique({
    where: {
      id: productId,
    },

    select: {
      id: true,
      title: true,
      description: true,
      price: true,
      images: true,
      category: true,
      seller: true,
    },
  });

  const otherProducts = await db.products.findMany({
    where: {
      seller: product?.seller,

      id: { not: productId },
    },
    orderBy: {
      createdAt: 'desc',
    },
    // take: 4,
  });

  const productReviews = await db.review.findMany({
    where: {
      productId,
    },

    orderBy: {
      createdAt: 'desc',
    },

    take: 4,
  });

  if (!product) {
    return notFound();
  }

  return (
    <Shell>
      <BreadCrumbs
        segments={[
          {
            name: 'Products',
            path: '/products',
          },
          {
            name: toTitleCase(product.category),
            path: `/products?category=${product.category}`,
          },
          {
            name: product.title,
            path: `/product/${product.id}`,
          },
        ]}
      />

      <div className='flex flex-col gap-8 md:flex-row md:gap-16'>
        <ProductImageCarousel
          className='w-full md:w-1/2'
          images={product.images ?? []}
          options={{
            loop: true,
          }}
        />
        <Separator className='mt-4 md:hidden' />

        <div className='flex flex-col gap-4 md:w-1/2'>
          <h2 className='text-2xl font-bold'>{product.title}</h2>
          <Accordion type='single' collapsible className='w-full'>
            <AccordionItem value='description'>
              <AccordionTrigger className='button button-ghost'>
                Description
              </AccordionTrigger>
              <AccordionContent className='text-sm text-muted-foreground'>
                {product.description ??
                  'No description provided is available for this product.'}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <div className='flex items-center justify-between'>
            <span className='text-xl font-bold text-muted-foreground'>
              {formatPrice(product.price, {
                currency: 'USD',
                notation: 'standard',
              })}
            </span>
            <AddToCartForm productId={productId} />
          </div>
        </div>
      </div>
      {otherProducts?.length > 0 ? (
        <div className='overflow-hidden md:pt-6'>
          <h2 className='line-clamp-1 flex-1 text-2xl font-normal '>
            More products from
            <span className='font-bold'> {product.seller}</span>
          </h2>
          <div className='overflow-x-auto pb-2 pt-6'>
            <div className='flex w-fit gap-4'>
              {otherProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  className='min-w-[260px]'
                />
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {productReviews?.length > 0 ? (
        <div className='overflow-hidden md:pt-6'>
          <div className='flex items-center justify-between'>
            <h2 className='line-clamp-1 text-2xl font-normal '>Reviews</h2>
            <ReviewForm productName={product.title} productId={product.id} />
          </div>
          <div className='overflow-x-auto pb-2 pt-6'>
            <div className='flex w-fit gap-4'>
              {productReviews.map(review => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className='flex items-center justify-start'>
          <ReviewForm productName={product.title} productId={product.id} />
        </div>
      )}
    </Shell>
  );
};

export default ProductDetail;
