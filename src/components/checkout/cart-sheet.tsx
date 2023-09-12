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
import { cn } from '@/lib/utils';

const CartSheet = () => {
  return (
    <Sheet>
      <SheetTrigger>
        <Button size='icon' className='relative' variant='outline'>
          <Icons.cart className='w-4 h-4' />
        </Button>
      </SheetTrigger>
      <SheetContent className='flex w-full flex-col pr-0 sm:max-w-lg'>
        <SheetHeader className='px-1'>
          <SheetTitle>Cart</SheetTitle>
        </SheetHeader>
        <div className='pr-6'>
          <Separator />
        </div>

        {/* empty cart to change if items is 0 */}
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
      </SheetContent>
    </Sheet>
  );
};

export default CartSheet;
