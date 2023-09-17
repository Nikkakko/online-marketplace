import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button, buttonVariants } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { cn, formatPrice } from '@/lib/utils';
import { getCartItems } from '@/app/_actions/cart';
import { Badge } from '../ui/badge';
import { CartLineItems } from './cart-line-items';

const CartSheet = async () => {
  // get carts
  const cartItems = await getCartItems();

  const cartLineItems = cartItems.map(item => {
    return {
      ...item.product,
      quantity: item.quantity,
      id: item.id,
    };
  });

  const itemCount = cartLineItems.reduce((total, item) => {
    return total + Number(item.quantity);
  }, 0);

  const cartTotal = cartLineItems.reduce((total, item) => {
    return total + Number(item.price) * Number(item.quantity);
  }, 0);

  return (
    <Sheet>
      <SheetTrigger>
        <Button size='icon' className='relative' variant='outline'>
          {cartItems.length > 0 && (
            <Badge
              variant='secondary'
              className='absolute -right-2 -top-2 h-6 w-6 justify-center rounded-full p-2.5'
            >
              {cartItems.length}
            </Badge>
          )}
          <Icons.cart className='w-4 h-4' />
        </Button>
      </SheetTrigger>
      <SheetContent className='flex w-full flex-col pr-0 sm:max-w-lg'>
        <SheetHeader className='px-1'>
          <SheetTitle>
            Cart ({itemCount} {itemCount === 1 ? 'item' : 'items'})
          </SheetTitle>
        </SheetHeader>
        <div className='pr-6'>
          <Separator />
        </div>

        {/* empty cart to change if items is 0 */}
        {cartItems.length > 0 ? (
          <>
            <CartLineItems items={cartLineItems} />
            <div className='flex flex-1 flex-col gap-5 overflow-hidden'></div>

            <div className='space-y-4 pr-6'>
              <Separator />
              <div className='flex'>
                <span className='flex-1'>Shipping</span>
                <span>Free</span>
              </div>

              <div className='flex'>
                <span className='flex-1'>Total</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>

              <SheetFooter>
                <SheetTrigger asChild>
                  <Link
                    href='/cart'
                    className={cn(
                      buttonVariants({
                        size: 'sm',
                        className: 'w-full',
                      })
                    )}
                  >
                    Continue to checkout
                  </Link>
                </SheetTrigger>
              </SheetFooter>
            </div>
          </>
        ) : (
          <div className='flex h-full flex-col items-center justify-center space-y-1'>
            <Icons.cart
              className='mb-4 h-16 w-16 text-muted-foreground'
              aria-hidden='true'
            />
            <div className='text-xl font-medium text-muted-foreground'>
              Your cart is empty
            </div>
            <SheetTrigger asChild>
              <Link
                href='/products'
                className={cn(
                  buttonVariants({
                    variant: 'link',
                    size: 'sm',
                    className: 'text-sm text-muted-foreground',
                  })
                )}
              >
                Add items to your cart to checkout
              </Link>
            </SheetTrigger>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartSheet;
