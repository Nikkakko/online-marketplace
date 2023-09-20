import type { Products } from '@prisma/client';
import { type Icons } from '@/components/icons';
import * as z from 'zod';
import { cartItemSchema, cartLineItemSchema } from '@/lib/validations/cart';

export interface Category {
  title: Products['category'];
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

export interface Review {
  id: string;
  title: string;
  description: string;
  rating: number;
  userId: string;
  createdAt: Date;
}

export interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[];
}
export interface NavItemWithOptionalChildren extends NavItem {
  items?: NavItemWithChildren[];
}

export type MainNavItem = NavItemWithOptionalChildren;

export type CartItem = z.infer<typeof cartItemSchema>;
export type CartLineItem = z.infer<typeof cartLineItemSchema>;

export type SidebarNavItem = NavItemWithChildren;
