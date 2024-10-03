import database from '@/db';
import { stripe } from '@/lib/stripe';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { redis } from '@/lib/redis';
import { headers } from 'next/headers';

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = headers().get('stripe-signature');

    if (!signature) {
      return new Response('Invalid signature', { status: 400 });
    }

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    if (event.type === 'charge.updated') {
      const charge = event.data.object as Stripe.Charge;
      
      console.log('Charge object:', charge);

      // Extract metadata
      const userId = charge.metadata?.userId;
      const orderId = charge.metadata?.orderId;
      const productId = charge.metadata?.productId;

      if (!userId || !orderId || !productId) {
        console.error('Missing metadata');
        return new Response('Missing metadata', { status: 400 });
      }

      const billingDetails = charge.billing_details?.address;
      const shippingDetails = charge.shipping?.address;

      if (!billingDetails || !shippingDetails) {
        console.error('Missing address details');
        return new Response('Missing address details', { status: 400 });
      }

      try {
        const shippingAddress = await database.shippingAddress.create({
          data: {
            name: charge.shipping?.name ?? 'Unknown',
            street: shippingDetails.line1 ?? 'Unknown Street',
            city: shippingDetails.city ?? 'Unknown City',
            state: shippingDetails.state ?? 'Unknown State',
            postalCode: shippingDetails.postal_code ?? '0000',
            country: shippingDetails.country ?? 'Unknown Country',
          },
        });

        const billingAddress = await database.billingAddress.create({
          data: {
            name: charge.billing_details?.name ?? 'Unknown',
            street: billingDetails.line1 ?? 'Unknown Street',
            city: billingDetails.city ?? 'Unknown City',
            state: billingDetails.state ?? 'Unknown State',
            postalCode: billingDetails.postal_code ?? '0000',
            country: billingDetails.country ?? 'Unknown Country',
          },
        });

        const updatedOrder = await database.order.update({
          where: { id: orderId },
          data: {
            email: charge.billing_details?.email ?? 'Unknown',
            intent_id: charge.payment_intent as string,
            pricePaidInCents: charge.amount_captured,
            shippingAddressId: shippingAddress.id,
            billingAddressId: billingAddress.id,
          },
        });

        const cartKey = `cart-${userId}`;
        const cart = await redis.get(cartKey);
        console.log('Cart data:', cart);
        await redis.del(cartKey);

        return NextResponse.json({ received: true, order: updatedOrder });
      } catch (err) {
        console.error('Error processing webhook:', err);
        return new Response('Error processing webhook', { status: 500 });
      }
    }

    return new Response('Unhandled event type', { status: 400 });
  } catch (err) {
    console.error('Error processing webhook:', err);
    return new Response('Webhook handler failed', { status: 500 });
  }
}
