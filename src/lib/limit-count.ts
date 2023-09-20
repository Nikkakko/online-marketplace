import { auth } from '@clerk/nextjs';
import db from '@/lib/db';

const MAX_FREE_COUNTS = 3;

export const increaseCount = async () => {
  const { userId, user } = auth();

  if (!userId) return;

  const userProductLimit = await db.userProductLimit.findUnique({
    where: {
      userId: userId,
    },
  });

  if (userProductLimit) {
    await db.userProductLimit.update({
      where: {
        userId: userId,
      },
      data: {
        limit: userProductLimit.limit + 1,
      },
    });
  } else {
    await db.userProductLimit.create({
      data: {
        userId: userId,
        limit: 1,
      },
    });
  }
};

export const checkApiLimit = async () => {
  const { userId } = auth();

  if (!userId) return false;

  const userProductLimit = await db.userProductLimit.findUnique({
    where: {
      userId: userId,
    },
  });

  if (userProductLimit && userProductLimit.limit >= MAX_FREE_COUNTS) {
    return false;
  } else if (!userProductLimit || userProductLimit.limit < MAX_FREE_COUNTS) {
    return true;
  }

  return true;
};

export const getProductLimitCount = async () => {
  const { userId } = auth();

  if (!userId) return;

  const userProductLimit = await db.userProductLimit.findUnique({
    where: {
      userId: userId,
    },
  });

  if (userProductLimit) {
    return userProductLimit.limit;
  }

  return 0;
};
