'use client'

import CheckoutForm from '@/components/CheckoutForm'
import { Elements } from '@stripe/react-stripe-js'
import { StripeElementsOptions, loadStripe } from '@stripe/stripe-js'
import { useEffect, useState } from 'react'

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
)

const PayPage = ({ params }: { params: { id: string } }) => {
  const [clientSecret, setClientSecret] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { id } = params

  // Capture subtotal from URL query
  const subtotal = new URLSearchParams(window.location.search).get('subtotal')

  useEffect(() => {
    const makeRequest = async () => {
      if (!subtotal || isNaN(parseFloat(subtotal))) {
        setError('Invalid subtotal')
        setLoading(false)
        return
      }

      const subtotalCents = Math.round(parseFloat(subtotal) * 100)

      try {
        const res = await fetch(
          `http://localhost:3000/api/create-intent/${id}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ subtotal: subtotalCents }), // Include subtotal in request body
          }
        )

        if (!res.ok) {
          throw new Error('Failed to create payment intent')
        }

        const data = await res.json()
        setClientSecret(data.clientSecret)
      } catch (err) {
        // Check if err is an instance of Error
        if (err instanceof Error) {
          setError(err.message)
        } else {
          setError('An unknown error occurred')
        }
      } finally {
        setLoading(false)
      }
    }

    makeRequest()
  }, [id, subtotal]) // Include subtotal in dependency array

  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: 'stripe',
    },
  }

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error}</p>

  return (
    <div>
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      )}
    </div>
  )
}

export default PayPage
