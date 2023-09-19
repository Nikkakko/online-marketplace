'use client';
import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button, buttonVariants } from '../ui/button';
import { useToast } from '../ui/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { reviewProductSchema } from '@/lib/validations/product';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { Icons } from '../icons';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Textarea } from '../ui/textarea';
import { addReviewToProductAction } from '@/app/_actions/product';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';

interface Props {
  productName: string;
  productId: string;
}

type Inputs = z.infer<typeof reviewProductSchema>;

const ReviewForm: React.FC<Props> = ({ productName, productId }) => {
  const [isPending, startTransition] = React.useTransition();
  const [open, setOpen] = React.useState(false);
  const { toast } = useToast();
  const { isSignedIn } = useUser();

  const form = useForm<Inputs>({
    resolver: zodResolver(reviewProductSchema),
    defaultValues: {
      description: '',
      rating: 0,
      title: '',
    },
  });

  if (!isSignedIn) {
    return (
      <Link href='/signin' className={buttonVariants({ size: 'sm' })}>
        Sign In to Add Review
        <span className='sr-only'>Sign In</span>
      </Link>
    );
  }

  const onSubmit = async (values: Inputs) => {
    try {
      startTransition(async () => {
        await addReviewToProductAction(values, productId);
        toast({
          title: 'Review Added',
          description: `Your review for ${productName} has been added`,
        });
        form.reset();
        setOpen(false);
      });

      //close dialog
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Something went wrong, please try again later.',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button>Add Review</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Add Review for <span className='font-bold'>{productName}</span>
          </DialogTitle>
          <DialogDescription>
            Your review will help other customers make informed decisions about
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            className='grid gap-4'
            onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
          >
            <FormField
              name='title'
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor='email'>Title</FormLabel>
                  <FormControl>
                    <Input {...field} type='text' placeholder='Title' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder='Description'
                      rows={4}
                      className='resize-none'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='rating'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rating</FormLabel>
                  <Select
                    onValueChange={value => {
                      field.onChange(Number(value));
                    }}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select a Rating' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='1'>1</SelectItem>
                      <SelectItem value='2'>2</SelectItem>
                      <SelectItem value='3'>3</SelectItem>
                      <SelectItem value='4'>4</SelectItem>
                      <SelectItem value='5'>5</SelectItem>
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type='submit' disabled={isPending}>
                {isPending && (
                  <Icons.spinner className='animate-spin mr-2 h-5 w-5' />
                )}
                Confirm
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewForm;
