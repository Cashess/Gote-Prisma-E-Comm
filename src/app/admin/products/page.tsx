import Link from "next/link";
import { PageHeader } from "../_components/pageHeader";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import database from "@/db";
import { CheckCircle2, MoreVertical, XCircle } from "lucide-react";
import { forematNumber, formatCurrency } from "@/lib/formatters";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import ActiveToggleDropdownItem, { DeleteDropdownItem } from "./_components/productActions";
  

export default function AdminProductsPage() {
    return <>
    <div className="flex items-center gap-4 justify-between">
    <PageHeader>
        products
    </PageHeader>
    <Link href="/admin/products/new">
    <Button type="submit">
        Add New Products
    </Button>
        </Link>
    </div>
    <ProductsTable/>
    </>
}

async function ProductsTable(){
  const products = await database.product.findMany({
    select:{
      id: true,
      name: true,
      priceInCents: true,
      isAvailableForPurchase: true,
      _count: { select: {orders: true }}
    },
    orderBy: {
      name: "asc"
    }
  })

  if (products.length === 0) return <p>
    No Products found
  </p>
    return <Table>
    <TableCaption><span className="sr-only">
    A list of Available for  Purchase.
        </span></TableCaption>
    <TableHeader>
      <TableRow>
        <TableHead className="w-[100px]">Name </TableHead>
        <TableHead>Price</TableHead>
        <TableHead>Shipping Rate</TableHead>
        <TableHead className="text-right">Orders</TableHead>
        <TableHead>
            <span className="sr-only">
                Actions
            </span>
        </TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {products.map(product => (
        <TableRow key={product.id}>
          <TableCell>
            {product.isAvailableForPurchase ? (<>
            <CheckCircle2/> <span className="sr-only">
              Available</span></>) : (
              <>
              <XCircle className="stroke-destructive"/>
              <span className="sr-only">
              Unavailable</span>
              </>
            )}
          </TableCell>
          <TableCell>
            {product.name}
          </TableCell>
          <TableCell>
            {formatCurrency(product.priceInCents / 100)}
          </TableCell>
          <TableCell>
            {forematNumber(product._count.orders)}
          </TableCell>
          <TableCell>
           <DropdownMenu>
            <DropdownMenuTrigger>
            <MoreVertical/>
            <span className="sr-only">Action</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem asChild>
                <a download href={`/admin/products/${product.id}/download`}>
                Download 
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
               <Link href={`/admin/products/${product.id}/edit`}> Edit</Link>
              </DropdownMenuItem>
              <ActiveToggleDropdownItem 
              id={product.id} 
              isAvailableForPurchase={product.
              isAvailableForPurchase}/>
              <DropdownMenuSeparator/>
              <DeleteDropdownItem id={product.id} disabled={product._count.orders > 0}/>
            </DropdownMenuContent>
           </DropdownMenu>
          </TableCell>

        </TableRow>
      ))}
      <TableRow>
        
      </TableRow>
    </TableBody>
  </Table>
  
}