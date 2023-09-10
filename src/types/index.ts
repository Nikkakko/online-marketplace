import type { Product } from '@prisma/client';
import { type Icons } from '@/components/icons';

export interface Category {
  title: Product['category'];
  image: string;
  icon: React.ComponentType<{ className?: string }>;
  subcategories: Subcategory[];
}

export interface Option {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export interface Subcategory {
  title: string;
  description?: string;
  image?: string;
  slug: string;
}

export interface NavItem {
  title: string;
  href?: string;
  disabled?: boolean;
  external?: boolean;
  icon?: keyof typeof Icons;
  label?: string;
  description?: string;
}

export interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[];
}
export interface NavItemWithOptionalChildren extends NavItem {
  items?: NavItemWithChildren[];
}

export type MainNavItem = NavItemWithOptionalChildren;
