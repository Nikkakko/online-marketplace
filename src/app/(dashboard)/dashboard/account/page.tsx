import { Shell } from '@/components/shell/shell';
import { UserProfile } from '@clerk/nextjs';
import React from 'react';

const AccountPage = () => {
  return (
    <Shell variant='sidebar'>
      <div className='flex flex-col space-y-2'>
        <h2 className='text-2xl font-bold'>Account</h2>
        <p className='text-sm text-gray-500'>Manage your account settings</p>
      </div>
      <section className='w-full overflow-hidden'>
        <UserProfile />
      </section>
    </Shell>
  );
};

export default AccountPage;
