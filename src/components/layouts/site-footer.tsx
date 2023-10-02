import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import * as React from 'react';
import { buttonVariants } from '../ui/button';
import { Icons } from '../icons';
import { Shell } from '../shell/shell';

function SiteFooter() {
  return (
    <footer className='w-full border-t bg-background'>
      <Shell as='div'>
        <section className='py-12 flex flex-col justify-between space-y-4 md:flex-row md:space-y-0 md:space-x-4 md:items-center'>
          <div className='flex items-center space-x-1 '>
            <span className='text-gray-400'>© {new Date().getFullYear()}</span>
            <span className='text-gray-600'>{siteConfig.title}</span>

            <Link
              href={siteConfig.links.github}
              target='_blank'
              rel='noreferrer'
              className={cn(
                buttonVariants({
                  size: 'lg',
                  variant: 'outline',
                })
              )}
            >
              View on GitHub
              <Icons.gitHub className='h-4 w-4 ml-2' aria-hidden='true' />
              <span className='sr-only'>GitHub</span>
            </Link>
          </div>
          <div className='flex items-center space-x-4'>
            <span className='text-gray-400'>Credits</span>
            <Link
              href='https://github.com/sadmann7'
              target='_blank'
              rel='noreferrer'
              className={cn(
                buttonVariants({
                  size: 'lg',
                  variant: 'outline',
                })
              )}
            >
              View on GitHub
              <Icons.gitHub className='h-4 w-4 ml-2' aria-hidden='true' />
              <span className='sr-only'>GitHub</span>
            </Link>
          </div>
        </section>
      </Shell>
    </footer>
  );
}

export default SiteFooter;
