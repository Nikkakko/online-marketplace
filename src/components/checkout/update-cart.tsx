'use client';
import * as React from 'react';
import { removeItemFromCart, updateItemQuantity } from '@/app/_actions/cart';
import { CartLineItem } from '@/types';
import { Button } from '../ui/button';
import { Icons } from '../icons';

interface UpdateCartProps {
  cartLineItem: CartLineItem;
}

export default function UpdateCart({ cartLineItem }: UpdateCartProps) {
  const [isPending, startTransition] = React.useTransition();

  return (
    <div className='flex items-center justify-normal space-x-2 md:space-x-10 '>
      <div className='flex items-center space-x-2 '>
        <Button
          size='icon'
          variant='outline'
          className='text-muted-foreground'
          disabled={isPending || cartLineItem.quantity === 1}
          onClick={() => {
            startTransition(() => {
              updateItemQuantity(cartLineItem.id, cartLineItem.quantity - 1);
            });
          }}
        >
          <Icons.minus className='w-4 h-4' />
        </Button>
        <span className='text-sm font-medium'>{cartLineItem.quantity}</span>
        <Button
          size='icon'
          variant='outline'
          className='text-muted-foreground'
          disabled={isPending}
          onClick={() => {
            startTransition(() => {
              updateItemQuantity(cartLineItem.id, cartLineItem.quantity + 1);
            });
          }}
        >
          <Icons.plus className='w-4 h-4' />
        </Button>
      </div>
      <Button
        size='icon'
        variant='outline'
        className='text-muted-foreground'
        onClick={() => {
          startTransition(() => {
            removeItemFromCart(cartLineItem.id);
          });
        }}
        disabled={isPending}
      >
        <Icons.trash className='w-4 h-4' />
      </Button>
    </div>
  );
}
