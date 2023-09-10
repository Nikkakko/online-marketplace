import type { Metadata } from 'next';

import LogOutButtons from '@/components/auth/logout-buttons';

import { Shell } from '@/components/shell/shell';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Sign Out',
  description: 'Sign out of your account.',
};

export default function SignOutPage() {
  return (
    <Shell className='max-w-xs ' variant='centered'>
      <Card
        id='sign-out-page-header'
        aria-labelledby='sign-out-page-header-heading'
        className='text-center'
      >
        <CardHeader>
          <CardTitle id='sign-out-page-header-heading'>Sign Out</CardTitle>
          <CardDescription>Are you sure you want to sign out?</CardDescription>
        </CardHeader>

        <CardFooter>
          <LogOutButtons />
        </CardFooter>
      </Card>
    </Shell>
  );
}
