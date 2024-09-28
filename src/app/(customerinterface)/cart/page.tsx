import { delItem } from '@/actions/orders'
import { DeleteItem } from '@/components/Button'
import { Cart } from '@/lib/interfaces'
import { redis } from '@/lib/redis'
import { Button } from '@/components/ui/button'
import { ShoppingBag } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { unstable_noStore as noStore } from 'next/cache'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { formatCurrency } from '@/lib/formatters'

export default async function BagRoute() {
  noStore()
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) {
    redirect('/')
  }

  // Retrieve the cart from Redis
  const cart: Cart | null = await redis.get(`cart-${userId}`)

  let totalPrice = 0
  cart?.items.forEach((item) => {
    totalPrice += item.priceInCents * item.quantity
  })

  return (
    <div className="max-w-2xl mx-auto mt-10 min-h-[55vh]">
      {!cart || !cart.items.length ? (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center mt-20">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <ShoppingBag className="w-10 h-10 text-primary" />
          </div>

          <h2 className="mt-6 text-xl font-semibold">
            <p>It&apos;s time to review your order.</p>

            <p>It&apos;s time to review your order.</p>
          </h2>
          <p>Here&apos;s what&apos;s in your cart:</p>
          <p>Here&apos;s what&apos;s in your cart:</p>
          <p className="mb-8 mt-2 text-center text-sm leading-6 text-muted-foreground max-w-sm mx-auto">
            We&apos;re preparing your order now.
          </p>

          <Button asChild>
            <Link href="/">Shop Now!</Link>
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-y-10">
          {cart?.items.map((item) => (
            <div key={item.id} className="flex">
              <div className="w-24 h-24 sm:w-32 sm:h-32 relative">
                <Image
                  className="rounded-md object-cover"
                  fill
                  src={item.imagePath}
                  alt={`Product image for ${item.name}`}
                />
              </div>
              <div className="ml-5 flex justify-between w-full font-medium">
                <p>{item.name}</p>
                <div className="flex flex-col h-full justify-between">
                  <div className="flex items-center gap-x-2">
                    <p>{item.quantity} x</p>
                    <p>{formatCurrency(item.priceInCents / 100)}</p>
                  </div>

                  <form action={delItem} className="text-end">
                    <input type="hidden" name="productId" value={item.id} />
                    <DeleteItem />
                  </form>
                </div>
              </div>
            </div>
          ))}
          <div className="mt-10">
            <div className="flex items-center justify-between font-medium">
              <p>Subtotal:</p>
              <p>{formatCurrency(totalPrice / 100)}</p>
            </div>

            {/* Checkout button - Pass the cartId dynamically */}
            <Link
              href={`/cart/${userId}/purchase/${userId}?cartId=cart-${userId}`}
            >
              <button className="w-full bg-black text-white p-3 rounded-md mt-6">
                Proceed to Checkout
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
