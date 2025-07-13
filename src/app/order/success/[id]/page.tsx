// app/order/success/[id]/page.tsx
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'

async function getOrder(id: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        product: true
      }
    })
    return order
  } catch (error) {
    console.error('Error fetching order:', error)
    return null
  }
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(price)
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'long',
    timeStyle: 'short'
  }).format(date)
}

export default async function OrderSuccessPage({ params }: { params: { id: string } }) {
  const order = await getOrder(params.id)

  if (!order) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-6 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-3xl font-bold">Pesanan Berhasil!</h1>
          <p className="text-green-100 mt-2">Terima kasih telah memesan di Warkop Nusantara</p>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Order Details */}
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Detail Pesanan
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">ID Pesanan:</span>
                <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                  {order.id}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tanggal:</span>
                <span className="font-medium">{formatDate(order.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Produk yang Dipesan
            </h3>
            <div className="flex items-center gap-4 bg-amber-50 p-4 rounded-lg">
              <div className="text-3xl">☕</div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800">{order.product.name}</h4>
                <p className="text-amber-600 font-bold">{formatPrice(order.product.price)}</p>
              </div>
            </div>
          </div>

          {/* Customer Info */}
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Informasi Pemesan
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Nama:</span>
                <span className="font-medium">{order.guestName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium">{order.guestEmail}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Telepon:</span>
                <span className="font-medium">{order.guestPhone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Alamat:</span>
                <span className="font-medium text-right max-w-xs">{order.guestAddress}</span>
              </div>
              {order.notes && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Catatan:</span>
                  <span className="font-medium text-right max-w-xs">{order.notes}</span>
                </div>
              )}
            </div>
          </div>

          {/* Next Steps */}
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Langkah Selanjutnya
            </h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-start gap-2">
                <span className="text-green-600">1.</span>
                <span>Pesanan Anda sedang diproses</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-600">2.</span>
                <span>Kami akan menghubungi Anda untuk konfirmasi</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-600">3.</span>
                <span>Pesanan akan dikirim sesuai alamat yang tertera</span>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>💡 Info:</strong> Untuk pertanyaan lebih lanjut, hubungi kami di 
                <strong> (021) 1234-5678</strong> atau email 
                <strong> info@warkopnusantara.com</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex gap-4 justify-center">
          <Link
            href="/menu"
            className="bg-gradient-to-r from-amber-600 to-orange-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-amber-700 hover:to-orange-700 transition-all duration-300"
          >
            Pesan Lagi
          </Link>
          <Link
            href="/"
            className="bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-all duration-300"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </main>
    </div>
  )
}