'use client';
import * as React from 'react';
import type { Products } from '@prisma/client';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from '@/components/ui/table';
import { cn, formatDate, formatPrice } from '@/lib/utils';
import { Button, buttonVariants } from './ui/button';
import { Icons } from './icons';
import Link from 'next/link';
import { deleteProductAction } from '@/app/_actions/product';
import DeleteProductModal from './delete-product-modal';
import qs from 'query-string';
import { useRouter, useSearchParams } from 'next/navigation';
import SortDialog from './SortDialog';
import { Shell } from '@/components/shell/shell';
import DataTablePagination from './DataTablePagination';

interface MyProductLIstProps {
  userProducts: Products[];
  limit: number;
  offset: number;
}

const MyProductLIst: React.FC<MyProductLIstProps> = ({
  userProducts,
  limit,
  offset,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSort = React.useCallback(
    (sort: { sort: string }) => {
      const query = {
        sort: sort.sort,
      };

      const url = qs.stringifyUrl(
        {
          url: '/dashboard/stores',
          query,
        },
        {
          skipEmptyString: true,
          skipNull: true,
        }
      );

      router.push(url);
    },
    [router]
  );

  console.log(userProducts.length);

  const handleRowsPerPage = React.useCallback(
    (limit: number, page: number) => {
      const query = {
        page: page > 1 ? page : 1,
        per_page: limit,
      };

      const url = qs.stringifyUrl(
        {
          url: '/dashboard/stores',
          query,
        },
        {
          skipEmptyString: true,
          skipNull: true,
        }
      );

      router.push(url);
    },
    [router]
  );

  const tableHeads = [
    {
      title: 'Name',
      sort: 'title',
    },
    {
      title: 'Category',
      sort: 'category',
    },
    {
      title: 'Price',
      sort: 'price',
    },
    {
      title: 'Created At',
      sort: 'createdAt',
    },
    {
      title: 'Actions',
    },
  ];

  return (
    <Shell>
      <Table>
        <TableCaption>
          A list of all your products and their status
        </TableCaption>
        <TableHeader>
          <TableRow>
            {tableHeads.map((head, idx) => (
              <TableHead
                key={head.title}
                className={cn(
                  idx === tableHeads.length - 1 ? 'text-right' : 'text-left'

                  //change color on hover
                )}
              >
                <div className='flex flex-col items-start gap-1'>
                  {head.sort ? (
                    <SortDialog handleSort={handleSort} head={head} />
                  ) : (
                    <span>{head.title}</span>
                  )}
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {userProducts.map(product => (
            <TableRow key={product.id}>
              <TableCell>{product.title}</TableCell>
              <TableCell className='capitalize'>{product.category}</TableCell>
              <TableCell>
                {formatPrice(product.price, {
                  currency: 'USD',
                  notation: 'standard',
                })}
              </TableCell>
              <TableCell className=''>
                {formatDate(product.createdAt)}
              </TableCell>
              <TableCell className='flex flex-row gap-2 justify-end'>
                <DeleteProductModal
                  productName={product.title}
                  productId={product.id}
                />
                <Link
                  href={`/product/${product.id}/edit`}
                  className={cn(
                    buttonVariants({
                      variant: 'outline',
                      size: 'sm',
                    })
                  )}
                >
                  <Icons.edit className='w-4 h-4' aria-hidden='true' />
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>

        <TableFooter className='bg-background text-primary'>
          <TableRow>
            <TableCell colSpan={5} className='text-right'>
              Total Products: {userProducts.length}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>

      <DataTablePagination
        limit={limit}
        offset={offset}
        totalProducts={userProducts.length}
        handleRowsPerPage={handleRowsPerPage}
      />
    </Shell>
  );
};

export default MyProductLIst;
