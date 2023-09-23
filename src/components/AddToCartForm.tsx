'use client';
import React, { FC } from 'react';

import { addToCart } from '@/app/_actions/cart';
import { Button } from './ui/button';
import { Icons } from './icons';

interface AddToCartFormProps {
  productId: string;
}

const AddToCartForm: FC<AddToCartFormProps> = ({ productId }) => {
  const [isPending, startTransition] = React.useTransition();

  const handleAddToCart = React.useCallback(
    (productId: string, quantity: number) => {
      startTransition(async () => {
        addToCart(productId, quantity);
      });
    },
    [startTransition]
  );
  return (
    <div className='flex flex-col items-center justify-center space-y-4'>
      <Button
        variant='outline'
        onClick={() => handleAddToCart(productId, 1)}
        disabled={isPending}
      >
        {isPending ? (
          <Icons.spinner className='animate-spin h-5 w-5 mr-2' />
        ) : (
          <Icons.cart className='h-5 w-5 mr-2' />
        )}
        Add to Cart
      </Button>

      {/* add update quntity elements */}
    </div>
  );
};

export default AddToCartForm;
