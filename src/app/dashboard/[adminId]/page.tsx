import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { prisma } from '@/lib/prisma'

async function getDashboardStats() {
  const [productCount, userCount] = await Promise.all([
    prisma.product.count(),
    prisma.user.count()
  ])

  return { productCount, userCount }
}

export default async function DashboardPage() {
  const { productCount, userCount } = await getDashboardStats()

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Total Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{productCount}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{userCount}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold text-gray-700">Active</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}