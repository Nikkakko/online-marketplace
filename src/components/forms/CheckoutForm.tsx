'use client';
import * as React from 'react';
import { Button } from '../ui/button';
import axios from 'axios';
import { useToast } from '../ui/use-toast';
import { loadStripe } from '@stripe/stripe-js';
import { Icons } from '../icons';
import { useRouter } from 'next/navigation';

interface CheckoutFormProps {}

const CheckoutForm: React.FC<CheckoutFormProps> = () => {
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const onPurchase = async () => {
    try {
      setLoading(true);
      const res = await axios.post('/api/stripe/checkout-session');
      window.location.href = res.data.url;
    } catch (error: any) {
      if (error.response.status === 401) {
        toast({
          title: 'Unauthorized',
          description: 'You must be logged in to continue',
        });
        router.push('/signin');
      } else {
        toast({
          title: 'Error',
          description: 'Something went wrong, please try again later.',
        });
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <Button
      type='submit'
      onClick={() => onPurchase()}
      disabled={loading}
      className='w-full
    '
    >
      {loading && <Icons.spinner className='w-4 h-4 animate-spin' />}
      Continue to Checkout
    </Button>
  );
};

export default CheckoutForm;
