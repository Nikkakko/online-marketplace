import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import * as React from 'react';
import { Button } from './ui/button';
import { useToast } from './ui/use-toast';
import axios from 'axios';

interface ProModalProps {}

const ProModal: React.FC<ProModalProps> = ({}) => {
  const [loading, setLoading] = React.useState(false);
  const { toast } = useToast();

  const onSubscribe = async () => {
    try {
      setLoading(true);
      const res = await axios.get('api/stripe');
      window.location.href = res.data.url;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Something went wrong, please try again later.',
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Upgrade to Pro</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>You are about to Subscribe to the Pro Plan</DialogTitle>
          <DialogDescription>
            This will allow you to add unlimited products to your store
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type='submit' onClick={onSubscribe} disabled={loading}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProModal;
