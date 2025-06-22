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

// Updated interface to match Next.js 15 requirements
interface PageProps {
  params: Promise<{ productId: string; adminId: string }>
}

export default async function EditProductPage({ params }: PageProps) {
  // Await the params Promise
  const { productId } = await params
  const product = await getProduct(productId)
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Edit Product</h1>
      <ProductForm product={product} isEdit={true} />
    </div>
  )
}