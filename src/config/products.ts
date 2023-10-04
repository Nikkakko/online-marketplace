import { Icons } from '@/components/icons';
import { Category, Option } from '@/types';
import { Backpack, Footprints, Shirt } from 'lucide-react';

export const sortOptions = [
  { label: 'Date: Old to new', value: 'createdAt.asc' },
  {
    label: 'Date: New to old',
    value: 'createdAt.desc',
  },
  { label: 'Price: Low to high', value: 'price.asc' },
  { label: 'Price: High to low', value: 'price.desc' },
];

export const productCategories = [
  {
    title: 'clothing',
    image: '/images/clothing-one.webp',
    icon: Shirt,
    subcategories: [
      {
        title: 'T-shirts',
        description: 'Cool and comfy tees for effortless style.',
        slug: 't-shirts',
      },
      {
        title: 'Hoodies',
        description: 'Cozy up in trendy hoodies, perfect for any season.  ',
        slug: 'hoodies',
      },
      {
        title: 'Pants',
        description: 'Relaxed and stylish pants for everyday wear.',
        slug: 'pants',
      },
      {
        title: 'Shorts',
        description: 'Stay cool with casual and comfortable shorts.',
        slug: 'shorts',
      },
    ],
  },
  {
    title: 'shoes',
    image: '/images/shoe-one.webp',
    icon: Footprints,
    subcategories: [
      {
        title: 'Mountain',
        description: 'Shoes for mountain hiking.',
        slug: 'mountain',
      },
      {
        title: 'Running',
        description: 'Shoes for running.',
        slug: 'running',
      },
      {
        title: 'Casual',
        description: 'Casual shoes.',
        slug: 'casual',
      },
      {
        title: 'Sneakers',
        description: 'Sneakers shoes.',
        slug: 'sneakers',
      },
      {
        title: 'Soccer',
        description: 'Soccer shoes.',
        slug: 'soccer',
      },
    ],
  },

  {
    title: 'sports',
    image: '/images/sports-one.webp',
    icon: Icons.sports,
    subcategories: [
      {
        title: 'Skateboards',
        description: 'Skateboards, longboards, and more.',
        slug: 'skateboards',
      },

      {
        title: 'Basketball',
        description: 'Basketballs, hoops, and more.',
        slug: 'basketball',
      },

      {
        title: 'Skiing',
        description: 'Skis, poles, and more for skiing.',
        slug: 'skiing',
      },

      {
        title: 'Swimming',
        description: 'Swimsuits, goggles, and more.',
        slug: 'swimming',
      },
    ],
  },
  {
    title: 'accessories',
    image: '/images/backpack-one.webp',
    icon: Backpack,
    subcategories: [
      {
        title: 'Skate Tools',
        description:
          'Essential tools for maintaining your skateboard, all rad.',
        slug: 'skate-tools',
      },

      {
        title: 'Hats',
        description: 'Keep the sun out of your eyes with our rad hats.',
        slug: 'hats',
      },

      {
        title: 'Socks',
        description: 'Keep your feet comfy and stylish with our rad socks.',
        slug: 'socks',
      },
      {
        title: 'Backpacks',
        description: 'Carry your gear in style with our rad backpacks.',
        slug: 'backpacks',
      },

      {
        title: 'Other',
        description: 'Other accessories.',
        slug: 'other',
      },
    ],
  },
] satisfies Category[];

export function getSubcategories(category?: string): Option[] {
  if (!category) return [];

  const subcategories =
    productCategories
      .find(c => c.title === category)
      ?.subcategories.map(s => ({
        label: s.title,
        value: s.slug,
      })) ?? [];

  return subcategories;
}
