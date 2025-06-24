import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { prisma } from '@/lib/prisma'
import { formatCurrency, formatDate } from '@/lib/utils'
import DeleteProductButton from '@/components/deleteProductButton'
import Image from 'next/image'

async function getProducts() {
  return await prisma.product.findMany({
    orderBy: { createdAt: 'desc' }
  })
}

async function getUsers() {
  return await prisma.user.findMany({
    select: {
      id: true
    }
  });
}

export default async function ProductsPage() {
  const products = await getProducts();
  const users = await getUsers();
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Products</h1>
        <Button asChild>
          <Link href={`/dashboard/${users[0].id}/products/create`}>Add Product</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Products List</CardTitle>
        </CardHeader>
        <CardContent>
          {products.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No products found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Image</th>
                    <th className="text-left p-3">Name</th>
                    <th className="text-left p-3">Price</th>
                    <th className="text-left p-3">Description</th>
                    <th className="text-left p-3">Created</th>
                    <th className="text-left p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium"><Image src={product.image || ''} alt={product.name} width={100} height={100} /></td>
                      <td className="p-3 font-medium">{product.name}</td>
                      <td className="p-3">{formatCurrency(product.price)}</td>
                      <td className="p-3">{product.desc || '-'}</td>
                      <td className="p-3">{formatDate(product.createdAt)}</td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" asChild>
                            <Link href={`/dashboard/${users[0].id}/products/${product.id}/edit`}>
                              Edit
                            </Link>
                          </Button>
                          <DeleteProductButton id={product.id} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}