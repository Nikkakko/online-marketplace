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
      if (session.metadata?.userId && !session.metadata?.cartItems) {
        const subscription = await stripe.subscriptions.retrieve(
          session.subscription as string
        );

        if (!session?.metadata?.userId) {
          return new NextResponse('Invalid webhook request', {
            status: 400,
          });
        }

        await db.userSubscription.create({
          data: {
            userId: session?.metadata.userId,
            stripeCustomerId: session.customer as string,
            stripeSubscriptionId: subscription.id,
            stripePriceId: subscription.items.data[0].price.id,
            stripeCurrentPeriodEnd: new Date(
              subscription.current_period_end * 1000
            ),
          },
        });
      }
    } else {
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

    if (event.type === 'invoice.payment_succeeded') {
      if (session.metadata?.userId && !session.metadata?.cartItems) {
        const subscription = await stripe.subscriptions.retrieve(
          session.subscription as string
        );

        await db.userSubscription.update({
          where: {
            stripeSubscriptionId: subscription.id,
          },

          data: {
            stripePriceId: subscription.items.data[0].price.id,
            stripeCurrentPeriodEnd: new Date(
              subscription.current_period_end * 1000
            ),
          },
        });
      }
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
