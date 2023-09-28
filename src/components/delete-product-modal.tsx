'use client';
import * as React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from './ui/button';
import { Icons } from './icons';
import { deleteProductAction } from '@/app/_actions/product';
import { useToast } from './ui/use-toast';

interface DeleteProductModalProps {
  productName: string;
  productId: string;
}

export default function DeleteProductModal({
  productName,
  productId,
}: DeleteProductModalProps) {
  const [isPending, startTransition] = React.useTransition();
  const { toast } = useToast();

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await deleteProductAction(productId);
        toast({
          title: 'Product deleted',
          description: `Your product "${productName}" has been deleted`,
        });
      } catch (error) {
        toast({
          title: 'An error occurred',
          description:
            'Something went wrong deleting your product. Please try again.',
        });
      }
    });
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button size='sm' className='z-10 ' variant='outline'>
          <Icons.trash className='w-4 h-4' aria-hidden='true' />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            product &quot;{productName}&quot;.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={isPending}
            onClick={handleDelete}
            className='bg-red-500 text-white'
          >
            {isPending ? 'Deleting...' : 'Confirm Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
