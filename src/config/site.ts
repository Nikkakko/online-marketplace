import { slugify } from '@/lib/utils';
import { productCategories } from './products';

const links = {
  github: 'https://github.com/Nikkakko/online-marketplace',
  githubAccount: 'https://github.com/Nikkakko',
  discord: 'https://discord.com/users/sadmann7',
};

export const siteConfig = {
  title: 'N-Store',
  description: `
        An open source eCommerce platform for selling digital products built with everything new in Next.js 13.`,

  url: 'https://nextjs-ecommerce-example.vercel.app',
  ogImage: 'https://skateshop.sadmn.com/opengraph-image.png',

  mainNav: [
    ...productCategories.map(category => ({
      title: category.title,
      items: [
        {
          title: 'All',
          href: `/categories/${slugify(category.title)}`,
          description: `All ${category.title}.`,
          items: [],
        },
        ...category.subcategories.map(subcategory => ({
          title: subcategory.title,
          href: `/categories/${slugify(category.title)}/${subcategory.slug}`,
          description: subcategory.description,
          items: [],
        })),
      ],
    })),
  ],
  links,
};
