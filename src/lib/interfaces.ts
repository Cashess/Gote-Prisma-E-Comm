export type Cart = {
  userId: string
  items: Array<{
    id: string
    name: string
    priceInCents: number
    quantity: number
    imagePath: string
  }>
}
