import { stripe } from '@/lib/stripe';
import { absoluteUrl } from '@/lib/utils';
import { auth, currentUser } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import db from '@/lib/db';
import Stripe from 'stripe';

const settingsUrl = absoluteUrl('/dashboard/stores');

export async function POST(req: Request, res: Response) {
  try {
    const { userId } = auth();
    const user = await currentUser();

    if (!userId || !user) {
      return new NextResponse('Unauthorized', {
        status: 401,
      });
    }

    //get cart items from db
    const cartItems = await db.cartItem.findMany();

    // get products from db
    const products = await db.products.findMany({
      where: {
        id: {
          in: cartItems.map(item => item.productId),
        },
        userId: userId,
      },
    });

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    // Loop through products and create line items
    products.forEach(product => {
      const cartItem = cartItems.find(item => item.productId === product.id);

      if (!cartItem) return;

      // Ensure that unit_amount is an integer representing cents
      const unitAmountCents = Math.round(product.price * 100);

      line_items.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: product.title,
            images: [product.images[0]],
          },
          unit_amount: unitAmountCents,
        },
        quantity: cartItem.quantity,
      });
    });

    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: settingsUrl,
      cancel_url: settingsUrl,
      billing_address_collection: 'required',

      metadata: {
        userId: userId,
        email: user.emailAddresses[0].emailAddress,
        cartItems: JSON.stringify(cartItems),
      },
    });

    return NextResponse.json({
      url: stripeSession.url,
    });
  } catch (error) {
    console.log(error, 'Stripe Checkout error');
    return new NextResponse('Internal Error', {
      status: 500,
    });
  }
}
