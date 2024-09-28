import database from "@/db";
import { notFound } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import mime from "mime";

export async function GET(req: NextRequest, { params: { id } }: { params: { id: string } }) {
  try {
    const product = await database.product.findUnique({
      where: { id },
      select: { filePath: true, name: true },
    });

    if (!product) {
      return notFound();
    }

    const filePath = product.filePath;
    const { size } = await fs.stat(filePath);
    const file = await fs.readFile(filePath);
    const extension = path.extname(filePath).slice(1); // Get file extension without the dot
    const contentType = mime.getType(extension) || 'application/octet-stream'; // Default MIME type

    return new NextResponse(file, {
      headers: {
        "Content-Disposition": `attachment; filename="${product.name}.${extension}"`,
        "Content-Length": size.toString(),
        "Content-Type": contentType,
      },
    });
  } catch (error) {
    console.error('Error handling file download:', error);
    return NextResponse.json({ error: 'Unable to process the file request' }, { status: 500 });
  }
}
