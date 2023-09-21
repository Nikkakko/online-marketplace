import { stripe } from '@/lib/stripe';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';
import db from '@/lib/db';
import { currentUser, auth } from '@clerk/nextjs';

export async function POST(req: Request, res: Response) {
  const body = await req.text();
  const user = await currentUser();
  const { userId } = auth();

  const signature = headers().get('Stripe-Signature') ?? '';

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    const session = event.data.object as Stripe.Checkout.Session;
    const address = session?.customer_details?.address;

    const addressComponents = [
      address?.line1,
      address?.line2,
      address?.city,
      address?.state,
      address?.postal_code,
    ];

    const addressString = addressComponents.filter(c => c !== null).join(', ');

    if (event.type === 'checkout.session.completed') {
      //get cart items from db
      const cartItems = await db.cartItem.findMany();

      // delete cart items
      await db.cartItem.deleteMany({
        where: {
          id: {
            in: cartItems.map(item => item.id),
          },
        },
      });
    }

    return new NextResponse(null, {
      status: 200,
    });
  } catch (error: any) {
    return new NextResponse(`Invalid webhook request ${error.message}`, {
      status: 400,
    });
  }
}
