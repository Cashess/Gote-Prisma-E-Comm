"use server"

import database from "@/db"
import OrderHistoryEmail from "../../emails/OrderHistory"
import { Resend } from "resend"
import { z } from "zod"

const emailSchema = z.string().email()
const resend = new Resend(process.env.RESEND_API_KEY as string)

export async function emailOrderHistory(
  prevState: unknown,
  formData: FormData
): Promise<{ message?: string; error?: string }> {
  const result = emailSchema.safeParse(formData.get("email"))

  if (result.success === false) {
    return { error: "Invalid email address" }
  }

  const user = await database.user.findUnique({
    where: { email: result.data },
    select: {
      email: true,
      orders: {
        select: {
          pricePaidInCents: true,
          id: true,
          createdAt: true,
          product: {
            select: {
              id: true,
              name: true,
              imagePath: true,
              description: true,
            },
          },
        },
      },
    },
  })

  if (user == null) {
    return {
      message:
        "Check your email to view your order history and download your products.",
    }
  }

  const orders = await Promise.all(
    user.orders.map(async (order) => {
      // Create a download verification and get its ID
      const downloadVerification = await database.downloadVerification.create({
        data: {
          expiresAt: new Date(Date.now() + 24 * 1000 * 60 * 60), // 24 hours expiration
          productId: order.product.id,
        },
      });
  
      // Return the order with all required fields
      return {
        id: order.id, // Ensure id is included
        pricePaidInCents: order.pricePaidInCents, // Ensure pricePaidInCents is included
        createdAt: order.createdAt, // Ensure createdAt is included
        downloadVerificationId: downloadVerification.id,
        product: {
          name: order.product.name, // Ensure product details are included
          imagePath: order.product.imagePath,
          description: order.product.description,
        },
      };
    })
  );
  

  const data = await resend.emails.send({
    from: `Support <${process.env.SENDER_EMAIL}>`,
    to: user.email,
    subject: "Order History",
    react: <OrderHistoryEmail orders={await Promise.all(orders)} />,
  })

  if (data.error) {
    return { error: "There was an error sending your email. Please try again." }
  }

  return {
    message:
      "Check your email to view your order history and download your products.",
  }
}