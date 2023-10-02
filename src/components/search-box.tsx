'use client';
import { useRouter } from 'next/navigation';
import React from 'react';
import { Icons } from './icons';
import { filterProductsAction } from '@/app/_actions/product';
import { $Enums, Category } from '@prisma/client';

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Skeleton } from '@/components/ui/skeleton';
import { useDebounce } from '@/hooks/use-debounce';
import { Products } from '@prisma/client';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { productCategories } from '@/config/products';
import { CircleIcon } from '@radix-ui/react-icons';

interface ProductGroup {
  category: Products['category'];
  products: Pick<Products, 'id' | 'title' | 'category'>[];
}

const SearchBox = () => {
  const router = useRouter();
  const [query, setQuery] = React.useState('');
  const [isOpen, setIsOpen] = React.useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const [data, setData] = React.useState<Products[] | null>(null);
  const [isPending, startTransition] = React.useTransition();

  React.useEffect(() => {
    if (debouncedQuery.length <= 0) {
      setData(null);
      return;
    }

    let mounted = true;
    function fetchData() {
      startTransition(async () => {
        const data = await filterProductsAction(debouncedQuery);
        if (mounted) {
          setData(data as any);
        }
      });
    }

    fetchData();

    return () => {
      mounted = false;
    };
  }, [debouncedQuery]);

  const handleSelect = React.useCallback((callback: () => unknown) => {
    setIsOpen(false);
    callback();
  }, []);

  React.useEffect(() => {
    if (!isOpen) {
      setQuery('');
    }
  }, [isOpen]);

  return (
    <>
      <Button
        variant='outline'
        className='relative h-9 w-9 p-0 xl:h-10 xl:w-60 xl:justify-start xl:px-3 xl:py-2'
        onClick={() => setIsOpen(true)}
      >
        <Icons.search className='h-4 w-4 xl:mr-2' aria-hidden='true' />
        <span className='hidden xl:inline-flex'>Search products...</span>
        <span className='sr-only'>Search products</span>
      </Button>

      <CommandDialog open={isOpen} onOpenChange={setIsOpen}>
        <CommandInput
          placeholder='Search products...'
          value={query}
          onValueChange={setQuery}
        />

        <CommandList>
          {isPending ? (
            <div className='space-y-1 overflow-hidden px-1 py-2'>
              <Skeleton className='h-4 w-10 rounded' />
              <Skeleton className='h-8  rounded-sm' />
              <Skeleton className='h-8  rounded-sm' />
            </div>
          ) : (
            //unique command Group

            <>
              {data
                ?.map(product => product.category)
                .filter((value, index, self) => self.indexOf(value) === index)
                .map(category => {
                  return (
                    <CommandGroup title={category} heading={category}>
                      {data?.map(product => {
                        if (product.category === category) {
                          return (
                            <CommandItem
                              value={product.title}
                              onSelect={() =>
                                handleSelect(() =>
                                  router.push(`/product/${product.id}`)
                                )
                              }
                            >
                              <div className='flex items-center space-x-2'>
                                <span>{product.title}</span>
                              </div>
                            </CommandItem>
                          );
                        }
                      })}
                    </CommandGroup>
                  );
                })}
            </>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default SearchBox;
