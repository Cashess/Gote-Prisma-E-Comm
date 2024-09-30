import cuid from 'cuid'; // Import cuid generator for unique IDs
import { stripe } from '@/lib/stripe' // Ensure this is the correct path for your stripe instance
import database from '@/db';
import { redis } from '../../../lib/redis' // Ensure correct redis import
import Stripe from 'stripe'

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('Stripe-Signature') as string;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_SECRET_WEBHOOK as string
    );
  } catch (error) {
    console.error(`⚠️  Webhook signature verification failed.`, error);
    return new Response('Webhook Error', { status: 400 });
  }

  // Handle Stripe events
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;

      // Ensure all session fields are safely accessed
      const userId = session.metadata?.userId;
      const productId = session.metadata?.productId;


      if (!session.amount_total || !session.payment_intent || !userId || !productId || !session.shipping_address_collection || !session.shipping_details) {
        console.error('Missing session data');
        return new Response('Missing session data', { status: 400 });
      }

      // Create an order in the database
      try {
        const createdOrder = await database.order.create({
          data: {
            id: cuid(),
            email: session.customer_details?.email ?? '',
            userId: userId,
            productId: productId,
            intent_id: session.payment_intent as string,
            pricePaidInCents: session.amount_total ?? 0,
            shippingStreet: session.shipping_details?.address?.line1 ?? "",
            shippingCity: session.shipping_details?.address?.city ?? '',
            shippingState: session.shipping_details?.address?.state ?? '',
            shippingPostalCode: session.shipping_details?.address?.postal_code ?? '',
            shippingCountry: session.shipping_details?.address?.country ?? '',
            billingName: session.customer_details?.name ?? '',
            billingStreet: session.customer_details?.address?.line1 ?? '',
            billingCity: session.customer_details?.address?.city ?? '',
            billingState: session.customer_details?.address?.state ?? '',
            billingPostalCode: session.customer_details?.address?.postal_code ?? '',
            billingCountry: session.customer_details?.address?.country ?? '',
          },
        });

        // Clear the user's cart from Redis
        await redis.del(`cart-${userId}`);
      } catch (error) {
        console.error('Error creating order:', error);
        return new Response('Error creating order', { status: 500 });
      }

      break;
    }
    default: {
      console.log(`Unhandled event type ${event.type}`);
      break;
    }
  }

  // Return a 200 response to acknowledge receipt of the event
  return new Response(null, { status: 200 });
}
