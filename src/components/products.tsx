'use client';
import { Products } from '@prisma/client';
import * as React from 'react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from './ui/dropdown-menu';
import { Button } from './ui/button';
import { Icons } from './icons';
import { sortOptions } from '@/config/products';
import { cn } from '@/lib/utils';
import qs from 'query-string';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { ProductCard } from './cards/product-card';
import PaginationButton from './pagination-button';

type Props = {
  products: Products[];
  pageCount: number;
};

const Products = ({ products, pageCount }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = React.useTransition();
  const searchParams = useSearchParams();

  //search params
  const sort = searchParams.get('sort') ?? 'createdAt_desc';
  const page = searchParams.get('page') ?? '1';
  const per_page = searchParams.get('per_page') ?? '8';

  const createQueryString = React.useCallback(
    (params: Record<string, string | number | null>) => {
      const query = {
        sort: params.sort ?? sort,
        page: params.page ?? page,
        per_page: params.per_page ?? per_page,
      };

      const url = qs.stringifyUrl(
        {
          url: pathname,
          query,
        },
        { skipEmptyString: true, skipNull: true }
      );

      router.push(url);
    },
    [searchParams]
  );

  return (
    <section className='flex flex-col space-y-6'>
      <div className='flex item-start'>
        <DropdownMenu>
          {products.length > 0 && (
            <DropdownMenuTrigger asChild>
              <Button size='sm'>
                Sort
                <Icons.chevronDown className='w-4 h-4 ml-2' />
              </Button>
            </DropdownMenuTrigger>
          )}

          <DropdownMenuContent align='start' className='w-48'>
            <DropdownMenuLabel>Sort by</DropdownMenuLabel>
            <DropdownMenuSeparator />

            {sortOptions.map(option => (
              <DropdownMenuItem
                key={option.label}
                className={cn(
                  'flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-left',
                  option.value === sort && 'bg-gray-100 text-gray-900'
                )}
                onClick={() =>
                  createQueryString({
                    sort: option.value,
                  })
                }
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {!products.length && (
        <div className='flex flex-col items-center justify-center py-12'>
          <Icons.store className='w-12 h-12 text-gray-400' />
          <p className='mt-4 text-lg font-medium text-center text-gray-500'>
            No products found
          </p>
        </div>
      )}

      <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {products.length ? (
        <PaginationButton
          pageCount={pageCount}
          page={page}
          per_page={per_page}
          sort={sort}
          router={router}
          pathname={pathname}
          isPending={isPending}
          startTransition={startTransition}
          createQueryString={createQueryString}
        />
      ) : null}
    </section>
  );
};

export default Products;
