import * as React from 'react';
import Link from 'next/link';
import { cn, truncate } from '@/lib/utils';
import { ChevronRightIcon } from 'lucide-react';

interface BreadCrumbsProps extends React.ComponentPropsWithoutRef<'nav'> {
  segments: {
    name: string;
    path: string;
  }[];
  separator?: React.ComponentType<{ className?: string }>;
  truncateLength?: number;
}

export function BreadCrumbs({
  segments,
  separator,
  className,
  truncateLength = 0,
  ...props
}: BreadCrumbsProps) {
  const SeparatorIcon = separator ?? ChevronRightIcon;

  return (
    <nav
      aria-label='breadcrumbs'
      className={cn(
        'flex items-center space-x-2 text-sm text-muted-foreground',
        className
      )}
      {...props}
    >
      {segments.map(({ name, path }, index) => {
        const isLast = index === segments.length - 1;
        const isTruncated = truncateLength && name.length > truncateLength;

        return (
          <React.Fragment key={name}>
            <Link
              href={path}
              className={cn(
                'flex items-center space-x-1',
                isLast ? 'font-bold' : ''
              )}
            >
              {isTruncated ? truncate(name, truncateLength) : name}
              {!isLast && <SeparatorIcon className='h-4 w-4' />}
            </Link>
          </React.Fragment>
        );
      })}
    </nav>
  );
}
