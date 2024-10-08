import { ProductCard, ProductCardSkeleton } from '@/components/ProductCard'
import database from '@/db'
import { cache } from '@/lib/cache'
import { JSX, Suspense } from 'react'

const getProducts = cache(() => {
  return database.product.findMany({
    where: {
      isAvailableForPurchase: true,
    },
    orderBy: { name: 'asc' },
  })
}, ['/products', 'getProducts'])
export default function ProductPage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Suspense
        fallback={
          <>
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
          </>
        }
      >
        <ProductsSuspense />
      </Suspense>
    </div>
  )
}

async function ProductsSuspense() {
  const products = await getProducts()

  return products.map(
    (
      product: JSX.IntrinsicAttributes & {
        id: string
        name: string
        priceInCents: number
        description: string
        imagePath: string
      }
    ) => <ProductCard key={product.id} {...product} />
  )
}
