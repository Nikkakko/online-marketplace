'use client';
import * as React from 'react';
import { Products } from '@prisma/client';
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from '../ui/card';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';
import { Icons } from '../icons';
import { AspectRatio } from '../ui/aspect-ratio';
import { Separator } from '../ui/separator';
import { Button } from '../ui/button';
import { addToCart } from '@/app/_actions/cart';
import { useToast } from '../ui/use-toast';

interface ProductCardProps extends React.HTMLAttributes<HTMLDivElement> {
  product: Pick<
    Products,
    'id' | 'title' | 'price' | 'images' | 'quantity' | 'rating' | 'seller'
  >;
}

export function ProductCard({
  product,
  className,
  ...props
}: ProductCardProps) {
  const [isPending, startTransition] = React.useTransition();
  const { toast } = useToast();

  return (
    <Card className={cn('h-full overflow-hidden rounded-sm')} {...props}>
      <Link href={`/product/${product.id}`}>
        <CardHeader className='border-b p-0'>
          <AspectRatio ratio={4 / 3}>
            {product?.images?.length ? (
              <Image
                src={product.images[0] ?? '/images/product-placeholder.webp'}
                alt={product.images[0] ?? product.title}
                className='object-cover'
                sizes='(min-width: 1024px) 5vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, (min-width: 475px) 50vw, 100vw'
                fill
                loading='lazy'
              />
            ) : (
              <div
                aria-label='Placeholder'
                role='img'
                aria-roledescription='placeholder'
                className='flex h-full w-full items-center justify-center bg-secondary'
              >
                <Icons.placeholder
                  className='h-9 w-9 text-muted-foreground'
                  aria-hidden='true'
                />
              </div>
            )}
          </AspectRatio>
        </CardHeader>
      </Link>
      <Link href={`/product/${product.id}`} tabIndex={-1}>
        <CardContent className='grid gap-2.5 p-4'>
          <CardTitle className='line-clamp-1'>{product.title}</CardTitle>
          <CardDescription className='line-clamp-2'>
            {product.price}
          </CardDescription>
        </CardContent>
      </Link>

      <Link href={`/product/${product.id}`} tabIndex={-1}>
        <CardFooter className='flex items-center justify-between p-4'>
          <div className='flex items-center space-x-1'>
            <Icons.star className='w-4 h-4 text-yellow-400' />
            <span className='text-sm text-muted-foreground'>
              {product.rating}
            </span>
          </div>
          <div className='flex items-center space-x-1'>
            <Icons.store className='w-4 h-4 text-muted-foreground' />
            <span className='text-sm text-muted-foreground'>
              {product.quantity}
            </span>
          </div>
        </CardFooter>
      </Link>

      <Separator />

      <div
        className='flex items-center justify-between p-4 space-x-2
        
        lg:w-56
      '
      >
        <Button
          type='button'
          variant='outline'
          className='flex items-center space-x-1 text-sm font-medium md:w-full'
          disabled={isPending}
          onClick={() => {
            startTransition(async () => {
              try {
                await addToCart(product.id, 1);
                toast({
                  title: 'Added to cart',
                  description: 'Product added to cart',
                });
              } catch (error) {
                toast({
                  title: 'Error',
                  description: 'Something went wrong, please try again.',
                });
              }
            });
          }}
        >
          {isPending && <Icons.spinner className='w-4 h-4 animate-spin' />}
          <Icons.cart className='w-4 h-4' />
          Add to cart
        </Button>
      </div>
    </Card>
  );
}
