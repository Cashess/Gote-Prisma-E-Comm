import database from "@/db"

export async function userOrderExists(email: string, productId: string) {
  return (
    (await database.order.findFirst({
      where: { user: { email }, productId },
      select: { id: true },
    })) != null
  )
}