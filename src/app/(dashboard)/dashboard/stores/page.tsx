import * as React from 'react';
import AddProductForm from '@/components/forms/AddProductForm';
import FreeProductCounter from '@/components/free-counter';
import { Shell } from '@/components/shell/shell';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getProductLimitCount } from '@/lib/limit-count';
import { checkSubscription } from '@/lib/subscription';
import MyProductLIst from '@/components/MyProductLIst';
import { currentUser } from '@clerk/nextjs';
import db from '@/lib/db';

interface Props {
  searchParams: {
    sort: 'createdAt.asc' | 'price.asc' | 'category.asc' | 'title.asc';
    page: string;
    per_page: string;
  };
}

async function StoresPage({
  searchParams: { sort = 'createdAt.asc', page, per_page },
}: Props) {
  const productLimitcount = await getProductLimitCount();
  const isPro = await checkSubscription();
  const user = await currentUser();

  const sortKey = sort?.split('.')[0];
  const sortValue = sort?.split('.')[1];

  const limit = typeof per_page === 'string' ? parseInt(per_page) : 10;
  const offset = typeof page === 'string' ? (parseInt(page) - 1) * limit : 0;

  const userProducts = await db.products.findMany({
    skip: offset,
    take: limit,

    where: {
      userId: user?.id as string,
    },

    orderBy: {
      [sortKey]: sortValue,
    },
  });

  return (
    <Shell>
      <div className='flex flex-col'>
        {!isPro && <FreeProductCounter productLimitcount={productLimitcount} />}
        <h2 className='text-2xl font-bold'>Add Product</h2>
        <p className='text-muted-foreground'>
          Add your product and start selling to your customers
        </p>
      </div>

      <Tabs defaultValue='new-product' className='w-full'>
        <TabsList>
          <TabsTrigger value='new-product'>New Product</TabsTrigger>
          <TabsTrigger value='my-products'>My Products</TabsTrigger>
        </TabsList>
        <TabsContent value='new-product'>
          <AddProductForm />
        </TabsContent>
        <TabsContent value='my-products'>
          <MyProductLIst
            userProducts={userProducts}
            limit={limit}
            offset={offset}
          />
        </TabsContent>
      </Tabs>
    </Shell>
  );
}

export default StoresPage;
