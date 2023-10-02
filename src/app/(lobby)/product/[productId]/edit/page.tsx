import AddProductForm from '@/components/forms/AddProductForm';
import { Shell } from '@/components/shell/shell';
import * as React from 'react';
import db from '@/lib/db';
import { currentUser } from '@clerk/nextjs';

import { Icons } from '@/components/icons';
import Link from 'next/link';
Link;

interface PageProps {
  params: {
    productId: string;
  };
}

async function EditPage({ params: { productId } }: PageProps) {
  const user = await currentUser();

  const product = await db.products.findUnique({
    where: {
      id: productId,
      userId: user?.id as string,
    },
  });

  if (!product) {
    return <div className='text-center'>Product not found</div>;
  }

  if (product.userId !== user?.id) {
    return (
      <div>
        <h1>Unauthorized</h1>
        <p>You are not authorized to edit this product</p>
        {/* redirect to all products */}
      </div>
    );
  }

  return (
    <Shell>
      <div className='flex items-center space-x-2'>
        <Link
          href='/dashboard/stores'
          className='flex items-center space-x-2 text-sm font-medium text-gray-500 hover:text-gray-600 hover:underline cursor-pointer'
        >
          <Icons.chevronLeft className='w-4 h-4' aria-hidden='true' />
          <span>Back</span>
        </Link>
      </div>

      <div className='flex flex-col'>
        <h2 className='text-2xl font-bold'>Edit Product</h2>
        <p className='text-muted-foreground'>
          Edit your product and start selling to your customers
        </p>
      </div>

      <AddProductForm initialData={product} />
    </Shell>
  );
}

export default EditPage;
