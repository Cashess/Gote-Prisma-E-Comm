import database from "@/db";
import { PageHeader } from "../../../_components/pageHeader";
import { ProductForm } from "../../_components/ProductForm";

export default async function EditProductsPage({params:{id}}: {params: {id: string}}) {
    const product = await database.product.findUnique({where: {id}})
    return (
        <>
        <PageHeader>
            Edit Products
        </PageHeader>
        <ProductForm product= {product}/>
        </>
      )
}