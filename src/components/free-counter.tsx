'use client';
import { useMounted } from '@/hooks/use-mounted';
import * as React from 'react';
import ProModal from './pro-modal';
import { MAX_FREE_COUNTS } from '@/lib/limit-count';

interface FreeCounterProps {
  productLimitcount: number | undefined;
}

const FreeProductCounter: React.FC<FreeCounterProps> = ({
  productLimitcount,
}) => {
  const mounted = useMounted();
  if (!mounted) return null;

  return (
    <div
      className='flex flex-col items-center justify-center w-full p-4 mb-4 bg-background
    border  rounded-md'
    >
      {productLimitcount === MAX_FREE_COUNTS ? (
        <p className='mb-2 text-sm text-center text-gray-500'>
          You have reached your free product limit. Please upgrade to Pro to add
          more products.
        </p>
      ) : (
        <p className='mb-2 text-sm text-center text-gray-500'>
          You have {productLimitcount} of {MAX_FREE_COUNTS} free products
          remaining
        </p>
      )}

      <ProModal />
    </div>
  );
};

export default FreeProductCounter;
