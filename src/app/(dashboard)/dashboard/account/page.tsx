import { Shell } from '@/components/shell/shell';
import { UserProfile, currentUser } from '@clerk/nextjs';
import db from '@/lib/db';
import React from 'react';
import { formatDate } from '@/lib/utils';

const AccountPage = async () => {
  const user = await currentUser();
  const subEnd = await db.userSubscription.findUnique({
    where: {
      userId: user?.id as string,
    },

    select: {
      stripeCurrentPeriodEnd: true,
    },
  });

  return (
    <Shell variant='sidebar'>
      <div className='flex flex-col space-y-2'>
        <h2 className='text-2xl font-bold'>Account</h2>
        <p className='text-sm text-gray-500'>Manage your account settings</p>
        <div className='flex flex-col space-y-2'>
          {subEnd?.stripeCurrentPeriodEnd ? (
            <div className='flex flex-col space-y-2'>
              <p className='text-sm text-gray-500'>
                Your subscription will end on{' '}
                <span className='font-bold'>
                  {formatDate(subEnd?.stripeCurrentPeriodEnd)}
                </span>
              </p>
            </div>
          ) : (
            <div className='flex flex-col space-y-2'>
              <p className='text-sm text-gray-500'>
                You are not currently subscribed to a plan
              </p>
            </div>
          )}
        </div>
      </div>
      <section className='w-full overflow-hidden'>
        <UserProfile />
      </section>
    </Shell>
  );
};

export default AccountPage;
