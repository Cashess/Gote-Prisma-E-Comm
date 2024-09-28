import cuid from 'cuid' // Import cuid generator
import database from '@/db'
import { stripe } from '@/lib/stripe'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { Resend } from 'resend'
import OrderReceivedEmail from '@/components/emails/OrderReceiveEmail'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  try {
    const body = await req.text()
    const signature = headers().get('stripe-signature')

    if (!signature) {
      return new Response('Invalid signature', { status: 400 })
    }

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session

      if (!session.customer_details?.email) {
        throw new Error('Missing customer email')
      }

      const { userId, orderId } = session.metadata || {
        userId: null,
        orderId: null,
      }

      if (!userId || !orderId) {
        throw new Error('Invalid request metadata')
      }

      const billingAddress = session.customer_details.address
      const shippingAddress = session.shipping_details?.address

      if (!billingAddress || !shippingAddress) {
        throw new Error('Missing billing or shipping address')
      }

      // Update the order in the database
      const updatedOrder = await database.order.update({
        where: {
          id: orderId,
        },
        data: {
          pricePaidInCents: session.amount_total ?? 0, // Handle potential null by defaulting to 0
          shippingAddress: {
            create: {
              id: cuid(), // Ensure a unique ID is created for the shipping address
              name: session.customer_details.name!,
              city: shippingAddress.city ?? '',
              country: shippingAddress.country ?? '',
              postalCode: shippingAddress.postal_code ?? '',
              street: shippingAddress.line1 ?? '',
              state: shippingAddress.state ?? '', // Handle null as an empty string
            },
          },
          billingAddress: {
            create: {
              id: cuid(), // Generate a unique ID for billing address
              name: session.customer_details.name!,
              city: billingAddress.city ?? '',
              country: billingAddress.country ?? '',
              postalCode: billingAddress.postal_code ?? '',
              street: billingAddress.line1 ?? '',
              state: billingAddress.state ?? '', // Handle null as an empty string
            },
          },
        },
      })

      // Send order confirmation email
      await resend.emails.send({
        from: `Support <${process.env.SENDER_EMAIL}>`,
        to: [session.customer_details.email],
        subject: 'Thanks for your order!',
        react: OrderReceivedEmail({
          orderId,
          orderDate: updatedOrder.createdAt.toLocaleDateString(),
          shippingAddress: {
            id: cuid(), // Generate another unique ID using cuid
            name: session.customer_details.name!,
            city: shippingAddress.city ?? '',
            country: shippingAddress.country ?? '',
            postalCode: shippingAddress.postal_code ?? '',
            street: shippingAddress.line1 ?? '',
            state: shippingAddress.state ?? '',
          },
        }),
      })

      return NextResponse.json({ result: event, ok: true })
    }

    return new Response('Unhandled event type', { status: 400 })
  } catch (err) {
    console.error('Error processing webhook:', err)
    return NextResponse.json(
      { message: 'Something went wrong', ok: false },
      { status: 500 }
    )
  }
}
