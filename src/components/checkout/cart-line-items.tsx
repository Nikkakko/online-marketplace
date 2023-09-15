import { cn, formatPrice } from '@/lib/utils';
import { CartLineItem } from '@/types';
import Image from 'next/image';
import { AspectRatio } from '../ui/aspect-ratio';
import { Icons } from '../icons';

import UpdateCart from './update-cart';

interface CartLineItemsProps extends React.HTMLAttributes<HTMLDivElement> {
  items: CartLineItem[];
}

export function CartLineItems({ items }: CartLineItemsProps) {
  return (
    <div className='h-full'>
      {items.map(item => (
        <div className='flex items-center p-3' key={item.id}>
          <div className='flex flex-1 items-center  space-x-4'>
            <div className='relative aspect-square h-16 w-16 min-w-fit overflow-hidden rounded'>
              {item?.images?.length ? (
                <Image
                  src={item.images[0] ?? '/images/product-placeholder.webp'}
                  alt={item.images[0] ?? item.title}
                  sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                  fill
                  className='absolute object-cover'
                  loading='lazy'
                />
              ) : (
                <div className='flex h-full items-center justify-center bg-secondary'>
                  <Icons.placeholder
                    className='h-4 w-4 text-muted-foreground'
                    aria-hidden='true'
                  />
                </div>
              )}
            </div>

            <div className='flex flex-col'>
              <p className='text-sm font-medium '>{item.title}</p>
              <p className='text-sm '>
                {formatPrice(item.price, {
                  currency: 'USD',
                  notation: 'standard',
                })}
              </p>
            </div>
          </div>
          <UpdateCart cartLineItem={item} />
        </div>
      ))}
    </div>
  );
}
