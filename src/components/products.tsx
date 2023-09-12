'use client';
import { Products } from '@prisma/client';
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
import { useEffect } from 'react';

type Props = {
  products: Products;
};

const Products = ({ products }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  console.log(products);

  //search params
  const sort = searchParams.get('sort') ?? 'createdAt_desc';

  const handleSortChange = (value: string) => {
    const query = {
      sort: value,
    };

    const url = qs.stringifyUrl(
      {
        url: pathname,
        query,
      },
      { skipEmptyString: true, skipNull: true }
    );

    router.push(url);
  };
  return (
    <section className='flex flex-col space-y-6'>
      <div className='flex item-start'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size='sm'>
              Sort
              <Icons.chevronDown className='w-4 h-4 ml-2' />
            </Button>
          </DropdownMenuTrigger>

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
                onClick={() => handleSortChange(option.value)}
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'></div>
    </section>
  );
};

export default Products;
