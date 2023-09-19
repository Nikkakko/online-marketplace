import * as React from 'react';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { clerkClient, currentUser } from '@clerk/nextjs';
import { formatDate } from '@/lib/utils';
import { Review } from '@/types';
import Link from 'next/link';
import DeleteUserReviewButton from '../DeleteUserReviewButton';
import { Separator } from '../ui/separator';
import { Icons } from '../icons';

interface ReviewCardProps {
  review: Review;
}

const ReviewCard: React.FC<ReviewCardProps> = async ({ review }) => {
  const userId = review.userId;
  const getUser = await clerkClient.users.getUser(userId);
  const user = await currentUser();

  const reviewUser = getUser?.username
    ? getUser.username
    : getUser?.emailAddresses[0].emailAddress.split('@')[0];
  const createdAt = formatDate(review.createdAt);

  //check if user is current user
  //if so, show delete button
  const checkUser = user?.id === userId;

  // stars for rating
  const rating = review.rating;
  const stars = [];
  for (let i = 0; i < 5; i++) {
    const starClassName = i < rating ? 'text-yellow-500' : 'text-gray-400';
    stars.push(
      <li key={i}>
        <Icons.star className={starClassName} aria-hidden='true' />
      </li>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{review.title}</CardTitle>
        <p className='text-muted-foreground font-light text-sm'>
          {reviewUser} - {createdAt}
        </p>
      </CardHeader>
      <CardContent>
        <CardDescription>{review.description}</CardDescription>
      </CardContent>
      <Separator />
      <CardFooter className='flex flex-col items-start mt-2'>
        <ul className='flex items-center space-x-1 text-sm text-yellow-500'>
          {stars}
        </ul>
        {checkUser && <DeleteUserReviewButton reviewId={review.id} />}
      </CardFooter>
    </Card>
  );
};

export default ReviewCard;
