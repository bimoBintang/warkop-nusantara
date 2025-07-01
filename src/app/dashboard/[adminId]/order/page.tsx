import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

async function getOrders() {
  return await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      product: true,
    },
  });
}

export default async function OrderPage() {
  const orders = await getOrders();

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200 text-sm">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="px-4 py-2 border-b">Order ID</th>
                  <th className="px-4 py-2 border-b">Guest ID</th>
                  <th className="px-4 py-2 border-b">Guest Name</th>
                  <th className="px-4 py-2 border-b">Guest Email</th>
                  <th className="px-4 py-2 border-b">Guest Phone</th>
                  <th className="px-4 py-2 border-b">Guest Address</th>
                  <th className="px-4 py-2 border-b">Product</th>
                  <th className="px-4 py-2 border-b">Price</th>
                  <th className="px-4 py-2 border-b">Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border-b">{order.id}</td>
                    <td className="px-4 py-2 border-b">{order.guestId || "-"}</td>
                    <td className="px-4 py-2 border-b">{order.guestName}</td>
                    <td className="px-4 py-2 border-b">{order.guestEmail}</td>
                    <td className="px-4 py-2 border-b">{order.guestPhone}</td>
                    <td className="px-4 py-2 border-b">{order.guestAddress}</td>
                    <td className="px-4 py-2 border-b">{order.product?.name || "-"}</td>
                    <td className="px-4 py-2 border-b">
                      Rp {order.product?.price?.toLocaleString() || "-"}
                    </td>
                    <td className="px-4 py-2 border-b">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
