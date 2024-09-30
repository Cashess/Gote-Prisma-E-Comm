'use client'
import { userOrderExists } from '@/app/actions/orders'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { formatCurrency } from '@/lib/formatters'
import { Cart } from '@/lib/interfaces'
import {
  AddressElement,
  Elements,
  LinkAuthenticationElement,
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import Image from 'next/image'
import { FormEvent, useState } from 'react'

// Load Stripe public key
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string
)

// Props for the Checkout form
type CheckOutFormProps = {
  cart: Cart // Cart contains items
  clientSecret: string // Client secret from Stripe
}

// Checkout form component
export function CheckOutForm({ cart, clientSecret }: CheckOutFormProps) {
  return (
    <div className="max-w-5xl w-full mx-auto space-y-8">
      <h1 className="text-2xl font-bold">Review Your Cart</h1>

      {cart.items.map((item) => (
        <div key={item.id} className="flex gap-4 items-center">
          <div className="aspect-video flex-shrink-0 w-1/3 relative">
            <Image
              src={item.imagePath}
              alt={item.name}
              className="object-cover w-full h-full"
              width={100}
              height={100}
            />
          </div>
          <div>
            <div className="text-lg">
              {formatCurrency(item.priceInCents / 100)}
            </div>
            <h2 className="text-xl font-bold">{item.name}</h2>
            <p>Quantity: {item.quantity}</p>
          </div>
        </div>
      ))}

      <Elements options={{ clientSecret }} stripe={stripePromise}>
        <Form cart={cart} />
      </Elements>
    </div>
  )
}

type FormProps = {
  cart: Cart // Passing the cart items
}

function Form({ cart }: FormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>()
  const [email, setEmail] = useState<string>()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()

    if (stripe == null || elements == null || email == null) return

    setIsLoading(true)

    // Checking if the user already purchased the product (based on the first item)
    const orderExists = await userOrderExists(email, cart.items[0].id)

    if (orderExists) {
      setErrorMessage(
        'You have already purchased this product. Try downloading it from the My Orders page.'
      )
      setIsLoading(false)
      return
    }

    // Confirm payment with Stripe
    stripe
      .confirmPayment({
        elements,
        confirmParams: {
          return_url: 'http://localhost:3000/stripe/purchase-success',
        },
      })
      .then(({ error }) => {
        if (
          error?.type === 'card_error' ||
          error?.type === 'validation_error'
        ) {
          setErrorMessage(error.message)
        } else {
          setErrorMessage('An unknown error occurred.')
        }
      })
      .finally(() => setIsLoading(false))
  }

  const totalPrice = cart.items.reduce(
    (acc, item) => acc + item.priceInCents * item.quantity,
    0
  )

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Checkout</CardTitle>
          {errorMessage && (
            <CardDescription className="text-destructive">
              {errorMessage}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <PaymentElement />
          <div className="mt-4">
            <LinkAuthenticationElement
              onChange={(e) => setEmail(e.value.email)}
            />
          </div>
          <div className="mt-4">
            <AddressElement options={{ mode: 'shipping' }} />
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full"
            size="lg"
            disabled={stripe == null || elements == null || isLoading}
          >
            {isLoading
              ? 'Purchasing...'
              : `Purchase - ${formatCurrency(totalPrice / 100)}`}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
