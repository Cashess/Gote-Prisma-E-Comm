import Business from '@/components/Businesses'
import Clients from '@/components/Clients'
import Hero from '@/components/HeroSections'
import { ProductCard, ProductCardSkeleton } from '@/components/ProductCard'
import { Button } from '@/components/ui/button'
import database from '@/db'
import { cache } from '@/lib/cache'
import styles from '@/style'
import { Product } from '@prisma/client'
import { ArrowRightCircle } from 'lucide-react'
import Link from 'next/link'
import { Suspense } from 'react'

const getNewestProducts = cache(() => {
  return database.product.findMany({
    where: {
      isAvailableForPurchase: true,
    },
    orderBy: { orders: { _count: 'desc' } },
    take: 6,
  })
}, ['/', 'getNewestProducts'])
const getPopularProducts = cache(
  () => {
    return database.product.findMany({
      where: {
        isAvailableForPurchase: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 6,
    })
  },
  ['/', 'getPopularProducts'],
  { revalidate: 60 * 60 * 24 }
)

export default function HomePage() {
  return (
    <main>
      <div className={`bg-gray-200 ${styles.flexStart} rounded-xl`}>
        <div className={`${styles.boxWidth}`}>
          <Hero />
          <Clients />
        </div>
      </div>
      <div className="">
        <Business />
      </div>
      <div className="mt-10">
        <ProductGridSection
          title="Most Amazing Products"
          productsFetcher={getPopularProducts}
        />

        <ProductGridSection
          title="Newest Collections"
          productsFetcher={getNewestProducts}
        />
      </div>
    </main>
  )
}

type ProductGridSectionProps = {
  title: string
  productsFetcher: () => Promise<Product[]>
}
async function ProductGridSection({
  productsFetcher,
  title,
}: ProductGridSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex gap-7">
        <h1 className="text-3xl font-bold">{title}</h1>
        <Button asChild variant="outline">
          <Link href="/products" className="space-x-2">
            <span>View All</span>
            <ArrowRightCircle className="size-4" />
          </Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Suspense
          fallback={
            <>
              <ProductCardSkeleton />
              <ProductCardSkeleton />
              <ProductCardSkeleton />
            </>
          }
        >
          <ProductSuspense productsFetcher={productsFetcher} />
        </Suspense>
      </div>
    </div>
  )
}

async function ProductSuspense({
  productsFetcher,
}: {
  productsFetcher: () => Promise<Product[]>
}) {
  return (await productsFetcher()).map((product) => (
    <ProductCard key={product.id} {...product} />
  ))
}
