'use server'

// import OrderHistoryEmail from "../../emails/OrderHistory";
import { z } from 'zod'
import { redirect } from 'next/navigation'
import { stripe } from '@/lib/stripe'
import { redis } from '@/lib/redis'
import { revalidatePath } from 'next/cache'
import { auth } from '@/auth'
import { Cart } from '@/lib/interfaces'
import Stripe from 'stripe'
import { Resend } from 'resend'
import database from '@/db' // Assuming a Prisma database client

const emailSchema = z.string().email()
const resend = new Resend(process.env.RESEND_API_KEY as string)

export async function addItem(productId: string) {
  const session = await auth()

  const userId = session?.user?.id
  if (!userId) {
    return redirect('/')
  }

  // Retrieve the cart from Redis
  let cart: Cart | null = await redis.get(`cart-${userId}`)

  // Find the product in the database using Prisma
  const selectedProduct = await database.product.findUnique({
    select: {
      id: true,
      name: true,
      priceInCents: true, // Make sure this is in cents
      imagePath: true, // Assuming imagePath is an array or a single string
    },
    where: {
      id: productId,
    },
  })

  if (!selectedProduct) {
    throw new Error('No product with this id')
  }

  // Initialize the cart object if it doesn't exist
  let updatedCart: Cart = cart || { userId, items: [] }

  // Check if the item already exists in the cart
  const existingItem = updatedCart.items.find((item) => item.id === productId)

  if (existingItem) {
    // If item already exists, increase its quantity
    existingItem.quantity += 1
  } else {
    // If item does not exist, add it to the cart
    updatedCart.items.push({
      id: selectedProduct.id,
      imagePath: Array.isArray(selectedProduct.imagePath)
        ? selectedProduct.imagePath[0]
        : selectedProduct.imagePath, // Handle imagePath as array or string
      name: selectedProduct.name,
      priceInCents: selectedProduct.priceInCents, // Ensure price is in cents
      quantity: 1,
    })
  }

  // Save the updated cart in Redis
  await redis.set(`cart-${userId}`, updatedCart)

  // Revalidate the cache for the homepage or other relevant pages
  revalidatePath('/')
}

export async function delItem(formData: FormData) {
  const session = await auth()
  const user = session?.user

  // Redirect to home if the user is not authenticated or userId is undefined
  if (!user || !user.id) {
    return redirect('/')
  }

  const userId = user.id // Now userId is guaranteed to be a string

  // Get the productId from the form data
  const productId = formData.get('productId')

  if (!productId || typeof productId !== 'string') {
    throw new Error('Invalid productId')
  }

  // Retrieve the user's cart from Redis
  let cart: Cart | null = await redis.get(`cart-${userId}`)

  // If the cart exists and contains items
  if (cart && cart.items) {
    const updatedCart: Cart = {
      userId: userId, // Now we are sure this is a valid string
      items: cart.items.filter((item) => item.id !== productId),
    }

    // Save the updated cart in Redis
    await redis.set(`cart-${userId}`, updatedCart)

    // Revalidate the cache for the cart page
    revalidatePath('/cart', 'layout')
  } else {
    // Handle case when cart is empty or doesn't exist
    throw new Error('Cart not found or is empty')
  }
}

// Create a new Stripe instance

export async function checkOut() {
  try {
    // Get the user session
    const session = await auth()
    const userId = session?.user?.id

    // Redirect to homepage if not authenticated
    if (!userId) {
      return redirect('/')
    }

    // Retrieve the user's cart from Redis
    const cart: Cart | null = await redis.get(`cart-${userId}`)

    // Check if the cart exists and is not empty
    if (cart && cart.items.length > 0) {
      // Map cart items to Stripe's line items
      const lineItems = cart.items.map((item) => ({
        price_data: {
          currency: 'usd',
          unit_amount: item.priceInCents, // Price in cents
          product_data: {
            name: item.name,
            images: [item.imagePath], // Make sure `imagePath` is a full URL
          },
        },
        quantity: item.quantity,
      }))

      // Create a Stripe Checkout session
      const stripeSession = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/stripe/purchase-success`,
        cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/stripe/cancel`,
        metadata: {
          userId: userId, // Optionally add user info to the metadata
        },
      })

      // Redirect the user to the Stripe Checkout page
      return redirect(stripeSession.url as string)
    } else {
      // Handle the case where the cart is empty or not found
      throw new Error('Cart is empty or not found.')
    }
  } catch (error) {
    console.error('Error during checkout process:', error)
    throw new Error('Unable to process the checkout at this time.')
  }
}
