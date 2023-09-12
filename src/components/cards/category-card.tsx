import type { Category } from '@/types';
import db from '@/lib/db';
import Link from 'next/link';
import { AspectRatio } from '../ui/aspect-ratio';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { buttonVariants } from '../ui/button';

interface Props {
  category: Category;
}

export async function CategoryCard({ category }: Props) {
  const productCount = await db.products.count({
    where: {
      category: {
        equals: category.title,
      },
    },
  });

  return (
    <Link
      href={`/categories/${category.title}`}
      className='group relative overflow-hidden rounded md border'
    >
      <AspectRatio ratio={16 / 9}>
        <div className='absolute inset-0 z-10 bg-zinc-950/70 transition-colors  group-hover:bg-zinc-950/75' />
        <Image
          src={category.image}
          alt={`${category.title} category`}
          className='object-cover transition-transform group-hover:scale-105'
          sizes='(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, (min-width: 475px) 50vw, 100vw'
          fill
          priority={true}
        />
      </AspectRatio>

      <div className='absolute inset-4 z-20 flex flex-col'>
        <div className='flex items-start justify-between space-x-4'>
          <div
            className={cn(
              buttonVariants({
                size: 'icon',
                className: 'pointer-events-none bg-zinc-200 text-zinc-950',
              })
            )}
          >
            <category.icon className='w-4 h-4' />
          </div>

          <p className='text-sm text-zinc-200'>
            {productCount} {productCount === 1 ? 'item' : 'items'}
          </p>
        </div>
        <h3 className='mt-auto text-xl font-medium capitalize text-zinc-200'>
          {category.title}
        </h3>
      </div>
    </Link>
  );
}
