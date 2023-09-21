import AddProductForm from '@/components/forms/AddProductForm';
import FreeProductCounter from '@/components/free-counter';
import { Shell } from '@/components/shell/shell';
import { getProductLimitCount } from '@/lib/limit-count';
import { checkSubscription } from '@/lib/subscription';
import * as React from 'react';

interface Props {}

async function StoresPage({}: Props) {
  const productLimitcount = await getProductLimitCount();
  const isPro = await checkSubscription();

  return (
    <Shell>
      <div className='flex flex-col'>
        {!isPro && <FreeProductCounter productLimitcount={productLimitcount} />}
        <h2 className='text-2xl font-bold'>Add your product</h2>
      </div>

      <AddProductForm />
    </Shell>
  );
}

export default StoresPage;
