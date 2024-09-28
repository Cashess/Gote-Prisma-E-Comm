import { notFound } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import database from '@/db'
import Image from 'next/image'
import Rating from '@/components/Rating'
import { ShoppingBagButton } from '@/components/Button'
import { addItem } from '@/actions/orders'

interface ProductDetailsProps {
  params: { id: string }
}

const ProductDetails = async ({ params: { id } }: ProductDetailsProps) => {
  const product = await database.product.findUnique({
    where: { id },
  })

  if (!product) notFound()
  const addProductToShoppingCart = addItem.bind(null, product.id)
  return (
    <>
      <section>
        <div className="grid grid-cols-1 md:grid-cols-5">
          <div className="col-span-2">
            <Image
              src={product.imagePath}
              alt="product-image"
              width={350}
              height={350}
              className="rounded-xl"
            />
          </div>

          <div className="col-span-2 flex flex-col w-full gap-8 p-5">
            <div className="flex flex-col gap-6">
              <p className="p-medium-16 rounded-full bg-grey-500/10 text-grey-500">
                {product.description}
              </p>
              <h1 className="h3-bold">{product.name}</h1>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center bg-yellow-300 rounded-full text-2xl border-separate">
                ${product.priceInCents / 100}
              </div>
            </div>

            <div>
              <p>Description:</p>
              <p>{product.description}</p>
            </div>
            <form action={addProductToShoppingCart}>
              <ShoppingBagButton />
            </form>
          </div>
        </div>
      </section>
      <section className="mt-10">
        <h2 className="h2-bold mb-5">Customer Reviews.... 9/10</h2>
        <Rating value={5} />
      </section>
    </>
  )
}

export default ProductDetails
