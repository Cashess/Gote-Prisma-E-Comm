import database from "@/db";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";

export async function GET(req: NextRequest, { params }: { params: { downloadVerificationId: string } }) {
    const { downloadVerificationId } = params;

    try {
        // Fetch the data from the database
        const data = await database.downloadVerification.findUnique({
            where: { 
                id: downloadVerificationId, 
                expiresAt: { gt: new Date() } 
            },
            select: { 
                product: { 
                    select: { 
                        filePath: true, 
                        name: true 
                    } 
                } 
            }
        });

        // Redirect if data or product is not found
        if (data == null || data.product == null) {
            return NextResponse.redirect(new URL("/products/download/expired", req.url));
        }

        // Get file information
        const { size } = await fs.stat(data.product.filePath);
        const file = await fs.readFile(data.product.filePath);
        const extension = data.product.filePath.split(".").pop();

        // Return the file as an attachment
        return new NextResponse(file, {
            headers: {
                "Content-Disposition": `attachment; filename="${data.product.name}.${extension}"`,
                "Content-Length": size.toString(),
            }
        });
    } catch (error) {
        // Handle unexpected errors
        console.error("Error processing the request:", error);
        return NextResponse.error();
    }
}
