import { CategoryCard } from '@/components/cards/category-card';
import { Shell } from '@/components/shell/shell';
import { buttonVariants } from '@/components/ui/button';
import { productCategories } from '@/config/products';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Balancer } from 'react-wrap-balancer';

export default async function IndexPage() {
  return (
    <Shell className='gap-12'>
      <section
        id='hero'
        className='mx-auto flex w-full max-w-[64rem] flex-col items-center justify-center gap-4 pb-8 pt-6 text-center md:pb-12 md:pt-10 lg:py-28'
      >
        <h1 className='text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:text-6xl lg:leading-[1.1]'>
          An online marketplace for Clothing, Shoes, Accessories, and Sports
        </h1>
        <Balancer className='max-w-[46rem] text-lg text-muted-foreground sm:text-xl'>
          Buy and sell new and pre-owned designer bags, shoes, clothing, and
          more...
        </Balancer>
        <div className='flex flex-wrap items-center justify-center gap-4'>
          <Link href='/products' className={cn(buttonVariants())}>
            Buy now
            <span className='sr-only'>Buy now</span>
          </Link>
          <Link
            href='/dashboard/stores'
            className={cn(
              buttonVariants({
                variant: 'outline',
              })
            )}
          >
            Sell now
            <span className='sr-only'>Sell now</span>
          </Link>
        </div>
      </section>
      <section id='categories' className='space-y-6 py-6 md:pt-10 lg:pt-24'>
        <div
          className='
          mx-auto flex flex-col items-center text-center space-y-4
          max-w-[58rem]
        '
        >
          <h2 className='text-2xl font-bold text-center md:text-3xl'>
            Shop by category
          </h2>
          <Balancer
            className='
            max-w-[46rem] text-lg text-muted-foreground sm:text-xl
          '
          >
            Browse our curated selection of new and pre-owned designer bags,
            shoes, clothing, and more...
          </Balancer>
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4'>
          {productCategories.map(category => (
            <CategoryCard key={category.title} category={category} />
          ))}
        </div>
      </section>

      <section id='featured' className='py-6 md:pt-10 lg:pt-24'>
        <div className='mx-auto flex flex-col items-center text-center space-y-4 max-w-[58rem]'>
          <h2 className='text-2xl font-bold text-center md:text-3xl'>
            Featured products
          </h2>

          <Balancer className='max-w-[46rem] text-lg text-muted-foreground sm:text-xl'>
            Featured products from our sellers and stores on the marketplace.
          </Balancer>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4'></div>
      </section>
    </Shell>
  );
}
