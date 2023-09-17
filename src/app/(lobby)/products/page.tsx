import { getProductsAction } from '@/app/_actions/product';
import Products from '@/components/products';
import { Shell } from '@/components/shell/shell';
import db from '@/lib/db';

interface Props {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

const ProductPage = async ({ searchParams }: Props) => {
  const { page, per_page, sort, categories, price } = searchParams ?? {};

  const limit = typeof per_page === 'string' ? parseInt(per_page) : 8;
  const offset = typeof page === 'string' ? (parseInt(page) - 1) * limit : 0;

  const getProducts = await getProductsAction({
    limit,
    offset,
    categories: typeof categories === 'string' ? categories : undefined,
    sort: typeof sort === 'string' ? sort : undefined,
    price: typeof price === 'string' ? price : undefined,
  });

  const pageCount = Math.ceil(getProducts.count / limit);

  return (
    <Shell>
      <Products
        products={getProducts.products}
        pageCount={pageCount}
        category=''
      />
    </Shell>
  );
};

export default ProductPage;
