'use server'

import cuid from 'cuid'
import database from '@/db/'
import { z } from 'zod'
import fs from 'fs/promises'
import path from 'path'
import { notFound, redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

// Schema validation
const fileSchema = z.instanceof(File, { message: 'Required' })
const imageSchema = fileSchema.refine(
  (file) => file.size === 0 || file.type.startsWith('image/')
)

const addSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  priceInCents: z.coerce.number().int().min(1),
  file: fileSchema.refine((file) => file.size > 0, 'Required'),
  image: imageSchema.refine((file) => file.size > 0, 'Required'),
})

export async function addProduct(prevState: unknown, formData: FormData) {
  const result = addSchema.safeParse(Object.fromEntries(formData.entries()))
  if (!result.success) {
    return result.error.formErrors.fieldErrors
  }

  const data = result.data
  const id = cuid()

  // Create directories if not exist
  await fs.mkdir('public/products', { recursive: true })

  // Save files to public/products
  const filePath = path.join('public', 'products', `${id}-${data.file.name}`)
  await fs.writeFile(filePath, Buffer.from(await data.file.arrayBuffer()))

  const imagePath = path.join('public', 'products', `${id}-${data.image.name}`)
  await fs.writeFile(imagePath, Buffer.from(await data.image.arrayBuffer()))

  // Store product details in database with relative image path
  await database.product.create({
    data: {
      isAvailableForPurchase: false,
      name: data.name,
      description: data.description,
      priceInCents: data.priceInCents,
      filePath: `/products/${id}-${data.file.name}`,
      imagePath: `/products/${id}-${data.image.name}`,
    },
  })

  // Revalidate and redirect
  revalidatePath('/')
  revalidatePath('/products')
  redirect('/admin/products')
}

const editSchema = addSchema.extend({
  file: fileSchema.optional(),
  image: imageSchema.optional(),
})

export async function updateProduct(
  id: string,
  prevState: unknown,
  formData: FormData
) {
  const result = editSchema.safeParse(Object.fromEntries(formData.entries()))
  if (!result.success) {
    return result.error.formErrors.fieldErrors
  }

  const data = result.data
  const product = await database.product.findUnique({ where: { id } })

  if (!product) return notFound()

  let filePath = product.filePath
  if (data.file && data.file.size > 0) {
    await fs.unlink(product.filePath)
    filePath = `/products/${cuid()}-${data.file.name}`
    await fs.writeFile(filePath, Buffer.from(await data.file.arrayBuffer()))
  }

  let imagePath = product.imagePath
  if (data.image && data.image.size > 0) {
    await fs.unlink(`public${product.imagePath}`)
    imagePath = `/products/${cuid()}-${data.image.name}`
    await fs.writeFile(
      `public${imagePath}`,
      Buffer.from(await data.image.arrayBuffer())
    )
  }

  await database.product.update({
    where: { id },
    data: {
      name: data.name,
      description: data.description,
      priceInCents: data.priceInCents,
      filePath,
      imagePath,
    },
  })

  revalidatePath('/')
  revalidatePath('/products')

  redirect('/admin/products')
}

export async function toggleProductAvailability(
  id: string,
  isAvailableForPurchase: boolean
) {
  try {
    await database.product.update({
      where: { id },
      data: { isAvailableForPurchase },
    })

    revalidatePath('/')
    revalidatePath('/products')
  } catch (error) {
    // Handle database errors
    console.error('Error toggling product availability:', error)
    throw new Error('Failed to toggle product availability')
  }
}

export async function deleteProduct(id: string) {
  const product = await database.product.delete({ where: { id } })

  if (!product) return notFound()

  await fs.unlink(product.filePath)
  await fs.unlink(`public${product.imagePath}`)

  revalidatePath('/')
  revalidatePath('/products')
}
