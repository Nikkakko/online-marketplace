import { getUserEmail } from '@/lib/utils';
import type { User } from '@clerk/nextjs/server';
import { siteConfig } from '@/config/site';
import MainNav from '@/components/layouts/main-nav';
import CartSheet from '@/components/checkout/cart-sheet';
import SearchBox from '@/components/search-box';
import Link from 'next/link';
import { Button, buttonVariants } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuShortcut,
} from '../ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Icons } from '../icons';

interface SiteHeaderProps {
  user: User | null;
}

export function SiteHeader({ user }: SiteHeaderProps) {
  const initials = `${user?.firstName?.charAt(0)}${user?.lastName?.charAt(0)}`;

  const email = getUserEmail(user);

  return (
    <header className='sticky top-0 z-50 w-full border-b bg-background'>
      <div className='container flex h-16 items-center'>
        <MainNav items={siteConfig.mainNav} />
        {/* add mobile nav */}
        <div className='flex-1 flex justify-end items-center space-x-4'>
          <nav className='flex items-center space-x-4'>
            <SearchBox />
            <CartSheet />

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    className='relative h-8 w-8 rounded-full'
                    variant='secondary'
                  >
                    <Avatar className='h-8 w-8'>
                      <AvatarImage
                        src={user.imageUrl}
                        alt={user.username ?? ''}
                      />
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end' className='w-56'>
                  <DropdownMenuLabel className='font-normal'>
                    <div className='flex flex-col space-y-1'>
                      <span className='text-sm font-medium leading-none'>
                        {user.firstName} {user.lastName}
                      </span>
                      <span className='text-xs leading-none text-muted-foreground'>
                        {email}
                      </span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                      <Link href='/dashboard/account'>
                        <Icons.user className='w-4 h-4 mr-2' />
                        Account
                        <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href='/dashboard/stores'>
                        <Icons.terminal
                          className='mr-2 h-4 w-4'
                          aria-hidden='true'
                        />
                        Dashboard
                        <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href='/signout'>
                      <Icons.logout className='w-4 h-4 mr-2' />
                      Log out
                      <DropdownMenuShortcut>⌘Q</DropdownMenuShortcut>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href='signin' className={buttonVariants({ size: 'sm' })}>
                Sign In
                <span className='sr-only'>Sign In</span>
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
