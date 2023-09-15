'use server';
import db from '@/lib/db';
import { currentUser } from '@clerk/nextjs';
import { User } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

export async function addToCart(productId: string, quantity: number) {
  const user: User | null = await currentUser();
  // Find the product by id
  const product = await db.products.findFirst({
    where: {
      id: productId,
    },
  });

  if (!product) {
    throw new Error('Product not found');
  }

  // Check if product is in stock
  if (product.quantity < quantity) {
    throw new Error('Product is out of stock, please try again later');
  }

  // Find the user's cart
  const cart = await db.cart.findFirst({
    where: {
      userId: user?.id,
    },
    include: {
      cartItems: true,
    },
  });

  if (!cart) {
    // create new cart
    const newCart = await db.cart.create({
      data: {
        userId: user?.id as string,
      },
    });

    // Add new cart item
    await db.cartItem.create({
      data: {
        cartId: newCart.id,
        productId,
        quantity,
      },
    });
  } else {
    // Check if product is already in cart
    const cartItem = await db.cartItem.findFirst({
      where: {
        productId,
        cartId: cart.id,
      },
    });

    if (cartItem) {
      // Update quantity
      await db.cartItem.update({
        where: {
          id: cartItem.id,
        },
        data: {
          quantity: cartItem.quantity + quantity,
        },
      });
    } else {
      // Add new cart item
      await db.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
        },
      });
    }
  }

  // Revalidate path
  revalidatePath('/');
}

export async function getCartItems() {
  const user: User | null = await currentUser();

  const cart = await db.cart.findFirst({
    where: {
      userId: user?.id,
    },

    include: {
      cartItems: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!cart) {
    return [];
  }

  return cart.cartItems;
}

export async function removeItemFromCart(id: string) {
  const user: User | null = await currentUser();
  console.log(id);

  const cart = await db.cart.findFirst({
    where: {
      userId: user?.id,
    },
  });

  if (!cart) {
    throw new Error('Cart not found');
  }

  await db.cartItem.delete({
    where: {
      id,
    },
  });

  // Revalidate path
  revalidatePath('/');
}

export async function updateItemQuantity(id: string, quantity: number) {
  const user: User | null = await currentUser();

  const cart = await db.cart.findFirst({
    where: {
      userId: user?.id,
    },
  });

  if (!cart) {
    throw new Error('Cart not found');
  }

  await db.cartItem.update({
    where: {
      id,
    },
    data: {
      quantity,
    },
  });

  // Revalidate path
  revalidatePath('/');
}
