import { redis } from '@/lib/redis'
import { notFound } from 'next/navigation'
import Stripe from 'stripe'
import { CheckOutForm } from '../_components/CheckOutForm'
import { Cart } from '@/lib/interfaces'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export default async function PurchasePage({
  params: { id, purchaseId },
  searchParams, // Capture query params like cartId
}: {
  params: { id: string; purchaseId: string }
  searchParams: { cartId?: string } // Destructure cartId from query params
}) {
  const cartId = searchParams.cartId

  if (!cartId) {
    return notFound() // Handle missing cartId
  }

  // Retrieve the cart from Redis using cartId
  const cart: Cart | null = await redis.get(cartId)

  if (!cart || cart.items.length === 0) {
    return notFound() // Handle empty or not found cart
  }

  // Proceed with the logic to handle Stripe payment and render Checkout Form
  const totalAmountInCents = cart.items.reduce(
    (acc: number, item: { priceInCents: number; quantity: number }) =>
      acc + item.priceInCents * item.quantity,
    0
  )

  if (totalAmountInCents <= 0) {
    throw new Error('The total amount must be greater than zero to proceed.')
  }

  // Create a payment intent for Stripe
  const paymentIntent = await stripe.paymentIntents.create({
    amount: totalAmountInCents,
    currency: 'usd',
    metadata: { userId: id },
  })

  if (!paymentIntent.client_secret) {
    throw new Error('Failed to create payment intent.')
  }

  // Return the checkout form with Stripe client secret and cart info
  return <CheckOutForm cart={cart} clientSecret={paymentIntent.client_secret} />
}
