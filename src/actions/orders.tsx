"use server"

import { Resend } from "resend";
import database from "@/db";
import OrderHistoryEmail from "../../emails/OrderHistory";
import { z } from "zod";

const emailSchema = z.string().email();
const resend = new Resend(process.env.RESEND_API_KEY as string);

export async function emailOrderHistory(
  prevState: unknown,
  formData: FormData
): Promise<{ message?: string; error?: string }> {
  // Validate email address
  const result = emailSchema.safeParse(formData.get("email"));

  if (result.success === false) {
    return { error: "Invalid email address" };
  }

  // Fetch user data including orders
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
  });

  if (user == null) {
    return {
      message: "Check your email to view your order history and download your products.",
    };
  }

  // Process orders
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
        id: order.id,
        pricePaidInCents: order.pricePaidInCents,
        createdAt: order.createdAt,
        downloadVerificationId: downloadVerification.id,
        product: {
          name: order.product.name,
          imagePath: order.product.imagePath,
          description: order.product.description,
        },
      };
    })
  );

  // Render OrderHistoryEmail component to static HTML
  const emailHtml = `<html>${(<OrderHistoryEmail orders={orders} />)}</html>`;

  // Send the email
  try {
    const data = await resend.emails.send({
      from: `Support <${process.env.SENDER_EMAIL}>`,
      to: user.email,
      subject: "Order History",
      html: emailHtml, // Use the HTML content here
    });

    if (data.error) {
      return { error: "There was an error sending your email. Please try again." };
    }
  } catch (error) {
    return { error: "There was an error sending your email. Please try again." };
  }

  return {
    message: "Check your email to view your order history and download your products.",
  };
}
