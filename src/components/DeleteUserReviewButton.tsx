'use client';
import { deleteReviewAction } from '@/app/_actions/product';
import * as React from 'react';
import { Button } from './ui/button';
import { Icons } from './icons';
import { useToast } from './ui/use-toast';

interface DeleteUserReviewButtonProps {
  reviewId: string;
}

const DeleteUserReviewButton: React.FC<DeleteUserReviewButtonProps> = ({
  reviewId,
}) => {
  const [isPending, startTransition] = React.useTransition();
  const { toast } = useToast();

  const handleDelete = async () => {
    try {
      startTransition(async () => {
        await deleteReviewAction(reviewId);
        toast({
          title: 'Review deleted',
          description: 'Your review has been deleted',
        });
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'There was an error deleting your review',
      });
    }
  };
  return (
    <Button
      variant='destructive'
      size='sm'
      onClick={handleDelete}
      disabled={isPending}
      className=' mt-2'
    >
      {isPending ? <Icons.spinner className='mr-2' /> : null}
      Delete
    </Button>
  );
};

export default DeleteUserReviewButton;
