import { stripe } from '@/lib/stripe';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';
import db from '@/lib/db';
import { currentUser, auth } from '@clerk/nextjs';
import { CartItem } from '@prisma/client';

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

    switch (event.type) {
      case 'checkout.session.completed':
        // If there is a user id, and no cartitems  in the metadata, then this is a new subscription
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
        } else {
          // else this is a one time purchase
          await db.cartItem.deleteMany({
            where: {
              userId: session.metadata?.userId,
            },
          });

          const cartItems = JSON.parse(session.metadata?.cartItems as string);

          //update product quantity
          cartItems.forEach(async (item: CartItem) => {
            const product = await db.products.findUnique({
              where: {
                id: item.productId,
              },
            });

            if (!product) return;

            await db.products.update({
              where: {
                id: item.productId,
              },
              data: {
                quantity:
                  product.quantity > item.quantity
                    ? product.quantity - item.quantity
                    : 0,
              },
            });
          });
        }

        break;

      case 'invoice.payment_succeeded':
        // If there is a user id, and no cart items in the metadata, then this is a new subscription
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

        break;
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
