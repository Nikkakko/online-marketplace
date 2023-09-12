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
  {
    label: 'Rating: Low to high',
    value: 'rating.asc',
  },
  {
    label: 'Rating: High to low',
    value: 'rating.desc',
  },
];

// categories
// electronics
//   clothing
//   shoes
//   accessories
//   sports
//   outdoor

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
        title: 'Low Tops',
        description: 'Rad low tops shoes for a stylish low-profile look.',
        slug: 'low-tops',
      },

      {
        title: 'High Tops',
        description: 'Elevate your style with rad high top shoes.',
        slug: 'high-tops',
      },
      {
        title: 'Slip-ons',
        description: 'Effortless style with rad slip-on shoes.',
        slug: 'slip-ons',
      },

      {
        title: 'Classics',
        description: 'Timeless style with rad classic shoes.',
        slug: 'classics',
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
        title: 'Bushings',
        description: 'Upgrade your ride with our rad selection of bushings.',
        slug: 'bushings',
      },
      {
        title: 'Shock & Riser Pads',
        description:
          "Enhance your skateboard's performance with rad shock and riser pads.",
        slug: 'shock-riser-pads',
      },
      {
        title: 'Skate Rails',
        description:
          'Add creativity and style to your tricks with our rad skate rails.',
        slug: 'skate-rails',
      },
      {
        title: 'Wax',
        description: 'Keep your board gliding smoothly with our rad skate wax.',
        slug: 'wax',
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
    ],
  },
] satisfies Category[];
