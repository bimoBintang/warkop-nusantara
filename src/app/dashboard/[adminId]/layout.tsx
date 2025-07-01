import { prisma } from '@/lib/prisma';
import Sidebar from '@/components/sidebar';

export default async function DashboardLayout({
  children,
 
}: {
  children: React.ReactNode,
}) {
  const data = await prisma.user.findMany();
  const navigation = [
    { name: 'Dashboard', href: `/dashboard/${data[0].id}` },
    { name: 'Products', href: `/dashboard/${data[0].id}/products` },
    { name: 'Orders', href: `/dashboard/${data[0].id}/order` },
]
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar navigation={navigation} />
      <main className="flex-1 overflow-y-auto p-8">
        {children}  
      </main>
    </div>
  )
}