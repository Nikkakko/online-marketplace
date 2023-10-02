import { getProductsAction } from '@/app/_actions/product';
import ProductsComponent from '@/components/products';
import { Shell } from '@/components/shell/shell';
import { toTitleCase, unslugify } from '@/lib/utils';
import { Products } from '@prisma/client';
import * as React from 'react';

interface SubcategoryProps {
  params: {
    category: Products['category'];
    subcategory: string;
  };
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

async function SubcategoryPage({ params, searchParams }: SubcategoryProps) {
  const { category, subcategory } = params;

  const { page, per_page, sort, price_range, store_ids, store_page } =
    searchParams;

  // Products transaction
  const limit = typeof per_page === 'string' ? parseInt(per_page) : 8;
  const offset = typeof page === 'string' ? (parseInt(page) - 1) * limit : 0;

  const productsTransaction = await getProductsAction({
    limit,
    offset,
    sort: typeof sort === 'string' ? sort : null,
    categories: category,
    subcategories: subcategory,
  });

  const pageCount = Math.ceil(productsTransaction.count / limit);

  return (
    <Shell>
      <div className='container py-8'>
        <h1 className='text-3xl font-bold mb-4'>
          {toTitleCase(unslugify(subcategory))}
        </h1>
        <p className='text-sm text-gray-500 mb-8'>
          {`Showing results for ${toTitleCase(
            unslugify(subcategory)
          )} in ${toTitleCase(unslugify(category))}`}
        </p>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {/* add products */}
        </div>
      </div>

      <ProductsComponent
        pageCount={pageCount}
        products={productsTransaction.products}
      />
    </Shell>
  );
}

export default SubcategoryPage;
