"use server" 

import database from "@/db"
import { revalidatePath } from "next/cache"
import { notFound } from "next/navigation"

export async function deleteUser(id: string) {
    const user = await database.user.delete({
        where: {
            id
        }
    })
    if (user == null) return notFound()

        return user
}