import { Shell } from '@/components/shell/shell';
import { $Enums } from '@prisma/client';

import db from '@/lib/db';
import Products from '@/components/products';
import { getProductsAction } from '@/app/_actions/product';

interface Props {
  params: {
    category: $Enums.Category;
  };
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}
export default async function CategoryPage({ params, searchParams }: Props) {
  const { category } = params;
  const { page, per_page, sort, price, rating } = searchParams;
  const limit = typeof per_page === 'string' ? parseInt(per_page) : 8;
  const offset = typeof page === 'string' ? (parseInt(page) - 1) * limit : 0;

  //fetch data from db
  const getProducts = await getProductsAction({
    limit,
    offset,
    categories: category,
    sort: typeof sort === 'string' ? sort : undefined,
    price: typeof price === 'string' ? price : undefined,
  });

  const pageCount = Math.ceil(getProducts.count / limit);

  return (
    <Shell>
      <div className='flex flex-col items-start'>
        <h1 className='text-3xl font-bold capitalize'>{category}</h1>
        <p className='text-sm leading-1 font-light text-muted-foreground'>
          buy {category} from the best sellers at the best price
        </p>
      </div>

      <Products id='category-page-products' products={getProducts.products} />
    </Shell>
  );
}
