"use server" 

import database from "@/db"
import { revalidatePath } from "next/cache"
import { notFound } from "next/navigation"

export async function deleteOrder(id: string) {
    const order = await database.order.delete({
        where: {
            id
        }
    })
    if (order == null) return notFound()

        return order
}