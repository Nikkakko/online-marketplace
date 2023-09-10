import { Shell } from '@/components/shell/shell';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function SignOutLoading() {
  return (
    <Shell className='max-w-xs'>
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
          <div className='flex w-full items-center space-x-2'>
            <Skeleton className='h-8 w-20' />
            <Skeleton className='h-8 w-20' />
          </div>
        </CardFooter>
      </Card>
    </Shell>
  );
}
