import path from "path"
import mime from "mime"
import { NextRequest, NextResponse } from "next/server"
import fs from "fs/promises"

export async function GET(
  req: NextRequest,
  { params: { downloadVerificationId } }: { params: { downloadVerificationId: string } }
) {
  const data = await database.downloadVerification.findUnique({
    where: { id: downloadVerificationId, expiresAt: { gt: new Date() } },
    select: { product: { select: { filePath: true, name: true } } },
  })

  if (data == null) {
    return NextResponse.redirect(new URL("/products/download/expired", req.url))
  }

  try {
    const filePath = data.product.filePath
    const { size } = await fs.stat(filePath)
    const file = await fs.readFile(filePath)
    const extension = path.extname(filePath).slice(1) // get file extension without dot
    const contentType = mime.getType(extension) || 'application/octet-stream'

    return new NextResponse(file, {
      headers: {
        "Content-Disposition": `attachment; filename="${data.product.name}.${extension}"`,
        "Content-Length": size.toString(),
        "Content-Type": contentType,
      },
    })
  } catch (error) {
    console.error('Error handling file download:', error)
    return NextResponse.json({ error: 'Unable to process the file request' }, { status: 500 })
  }
}
