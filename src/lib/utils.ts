import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { User } from '@clerk/nextjs/server';
import * as z from 'zod';
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getUserEmail(user: User | null) {
  const email =
    user?.emailAddresses?.find(e => e.id === user.primaryEmailAddressId)
      ?.emailAddress ?? '';

  return email;
}

export function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}

export function formatPrice(
  price: number,
  options: {
    currency?: 'USD' | 'EUR' | 'GBP' | 'BDT';
    notation?: Intl.NumberFormatOptions['notation'];
  }
) {
  const { currency = 'USD', notation = 'compact' } = options;

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    notation,
  }).format(price);
}

export function truncate(str: string, length: number) {
  return str.length > length ? str.substring(0, length - 3) + '...' : str;
}

export function toTitleCase(str: string) {
  return str.replace(
    /\w\S*/g,
    txt => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase()
  );
}
