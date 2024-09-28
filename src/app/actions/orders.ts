"use server";

import database from "@/db";

export async function userOrderExists(email: string, productId: string): Promise<boolean> {
  try {
    const order = await database.order.findFirst({
      where: {
        user: {
          email,
        },
        productId,
      },
      select: {
        id: true,
      },
    });
    
    return order !== null;
  } catch (error) {
    console.error("Error checking if user order exists:", error);
    return false; // Or handle the error as needed
  }
}
