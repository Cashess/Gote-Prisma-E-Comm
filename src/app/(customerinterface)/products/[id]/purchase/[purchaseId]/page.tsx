import database from '@/db'
import { notFound } from 'next/navigation'
import Stripe from 'stripe'
import { CheckOutForm } from '../_components/CheckOutForm'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export default async function PurchasePage({
  params: { id },
}: {
  params: { id: string }
}) {
  const product = await database.product.findUnique({
    where: { id },
  })
  if (product == null) return notFound()
  const paymentIntents = await stripe.paymentIntents.create({
    amount: product.priceInCents,
    currency: 'USD',
    metadata: { productId: product.id },
  })
  if (paymentIntents.client_secret == null) {
    throw Error('Stripe failed to create payment intent')
  }
  return (
    <CheckOutForm
      product={product}
      clientSecret={paymentIntents.client_secret}
    />
  )
}
