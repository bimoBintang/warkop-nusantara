import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import ProductForm from '@/components/productForm'

async function getProduct(productId: string) {
  const product = await prisma.product.findUnique({
    where: { id: productId }
  })

  if (!product) {
    notFound()
  }

  return product
}

interface PageProps {
  params: {
    adminId: string
    productId: string
  }
}

export default async function EditProductPage({ params }: PageProps) {
  const product = await getProduct(params.productId)

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Edit Product</h1>
      <ProductForm product={product} isEdit={true} />
    </div>
  )
}
