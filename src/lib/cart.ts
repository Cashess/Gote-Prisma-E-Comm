// import { cookies } from 'next/dist/client/components/headers'
// import database from '../db'
// import { auth } from '@/auth'

// import { PrismaClient, Prisma, Cart, CartItem } from '@prisma/client'

// const prisma = new PrismaClient()

// // Define types
// export type CartWithProducts = Prisma.CartGetPayload<{
//   include: { items: { include: { product: true } } }
// }>

// export type CartItemWithProduct = Prisma.CartItemGetPayload<{
//   include: { product: true }
// }>

// export type ShoppingCart = CartWithProducts & {
//   size: number
//   subtotal: number
// }

// interface Product {
//   id: string
//   priceInCents: number
//   // other product fields
// }

// interface CartItem {
//   quantity: number
//   product: Product
// }

// export async function getCart(cartId: string): Promise<ShoppingCart | null> {
//   const session = await auth()

//   let cart: CartWithProducts | null = null

//   if (session) {
//     // Fetch cart for authenticated user
//     cart = await database.cart.findFirst({
//       where: { userId: session.user?.id ?? undefined },
//       include: { items: { include: { product: true } } },
//     })
//   } else {
//     // Fetch local cart using localCartId from cookies
//     const localCartId = cookies().get('localCartId')?.value
//     if (localCartId) {
//       cart = await database.cart.findUnique({
//         where: { id: localCartId },
//         include: { items: { include: { product: true } } },
//       })
//     }
//   }

//   if (!cart) {
//     return null
//   }

//   // Calculate size and subtotal
//   const size = cart.items.reduce(
//     (acc: any, item: { quantity: any }) => acc + item.quantity,
//     0
//   )
//   const subtotal = cart.items.reduce(
//     (
//       acc: number,
//       item: { quantity: number; product: { priceInCents: number } }
//     ) => acc + item.quantity * item.product.priceInCents,
//     0
//   )

//   return {
//     ...cart,
//     size,
//     subtotal,
//   }
// }

// export async function createCart(): Promise<ShoppingCart> {
//   const session = await auth()

//   let newCart: Cart

//   if (session) {
//     newCart = await prisma.cart.create({
//       data: { userId: session.user?.id },
//     })
//   } else {
//     newCart = await prisma.cart.create({
//       data: {},
//     })

//     // Note: Needs encryption + secure settings in real production app
//     cookies().set('localCartId', newCart.id)
//   }

//   return {
//     ...newCart,
//     items: [],
//     size: 0,
//     subtotal: 0,
//   }
// }

// export async function mergeAnonymousCartIntoUserCart(userId: string) {
//   const localCartId = cookies().get('localCartId')?.value

//   const localCart = localCartId
//     ? await prisma.cart.findUnique({
//         where: { id: localCartId },
//         include: { items: true },
//       })
//     : null

//   if (!localCart) return

//   const userCart = await prisma.cart.findFirst({
//     where: { userId },
//     include: { items: true },
//   })

//   await prisma.$transaction(
//     async (tx: {
//       cartItem: {
//         deleteMany: (arg0: { where: { cartId: any } }) => any
//         createMany: (arg0: {
//           data: { cartId: any; productId: any; quantity: any }[]
//         }) => any
//       }
//       cart: {
//         create: (arg0: {
//           data: { userId: string; items: { createMany: { data: any } } }
//         }) => any
//         delete: (arg0: { where: { id: any } }) => any
//       }
//     }) => {
//       if (userCart) {
//         const mergedCartItems = mergeCartItems(localCart.items, userCart.items)

//         await tx.cartItem.deleteMany({
//           where: { cartId: userCart.id },
//         })

//         await tx.cartItem.createMany({
//           data: mergedCartItems.map((item) => ({
//             cartId: userCart.id,
//             productId: item.product,
//             quantity: item.quantity,
//           })),
//         })
//       } else {
//         await tx.cart.create({
//           data: {
//             userId,
//             items: {
//               createMany: {
//                 data: localCart.items.map(
//                   (item: { productId: any; quantity: any }) => ({
//                     productId: item.productId,
//                     quantity: item.quantity,
//                   })
//                 ),
//               },
//             },
//           },
//         })
//       }

//       await tx.cart.delete({
//         where: { id: localCart.id },
//       })
//       // throw Error("Transaction failed");
//       cookies().set('localCartId', '')
//     }
//   )
// }

// function mergeCartItems(...cartItems: CartItem[][]): CartItem[] {
//   return cartItems.reduce((acc, items) => {
//     items.forEach((item) => {
//       const existingItem = acc.find((i) => i.product === item.product)
//       if (existingItem) {
//         existingItem.quantity += item.quantity
//       } else {
//         acc.push(item)
//       }
//     })
//     return acc
//   }, [] as CartItem[])
// }
