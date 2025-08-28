"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/cartContext";
import { formatCurrency } from "@/lib/utils";
import { Minus, Plus, Trash2, ArrowLeft, ShoppingBag } from "lucide-react";
import Image from "next/image";
import React from "react";

// Types untuk data order berdasarkan schema Prisma yang diberikan
interface OrderData {
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  guestAddress: string;
  notes?: string;
  orders: {
    productId: string;
    quantity: number; // Akan dihandle di logic bisnis
  }[];
}

interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  notes: string;
}

interface CheckoutProps {
  // Fungsi untuk mengirim data ke server menggunakan Prisma
  onSubmitOrder: (orderData: OrderData) => Promise<{ success: boolean; orderIds?: string[]; error?: string }>;
  // Optional: Data order yang sudah ada (untuk edit)
  existingOrder?: {
    id: string;
    guestId: string;
    guestName: string;
    guestEmail: string;
    guestPhone: string;
    guestAddress: string;
    productId: string;
    product: {
      name: string;
      price: number;
      image: string;
      desc: string;
    };
  };
}

export default function Checkout({ onSubmitOrder, existingOrder }: CheckoutProps) {
  const router = useRouter();
  const { cartItems, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCart();

  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: existingOrder?.guestName || "",
    email: existingOrder?.guestEmail || "",
    phone: existingOrder?.guestPhone || "",
    address: existingOrder?.guestAddress || "",
    notes: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const deliveryFee = 5000;
  const subtotal = getTotalPrice();
  const total = subtotal + deliveryFee;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({ ...prev, [name]: value }));
    // Clear error saat user mulai mengetik
    if (submitError) setSubmitError(null);
  };

  const handleQuantityChange = (productId: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, quantity);
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Validasi form
      if (!customerInfo.name.trim()) {
        throw new Error("Nama lengkap harus diisi");
      }
      if (!customerInfo.phone.trim()) {
        throw new Error("Nomor telepon harus diisi");
      }
      if (!customerInfo.address.trim()) {
        throw new Error("Alamat lengkap harus diisi");
      }
      if (!customerInfo.email.trim()) {
        throw new Error("Email harus diisi");
      }

      // Prepare data untuk dikirim ke server
      // perlu membuat multiple orders untuk multiple items
      const orderData: OrderData = {
        guestName: customerInfo.name.trim(),
        guestEmail: customerInfo.email.trim(),
        guestPhone: customerInfo.phone.trim(),
        guestAddress: customerInfo.address.trim(),
        notes: customerInfo.notes.trim() || undefined,
        orders: cartItems.map(item => ({
          productId: item.id,
          quantity: item.quantity
        }))
      };

      // Kirim data menggunakan fungsi yang diberikan parent
      const result = await onSubmitOrder(orderData);

      if (result.success) {
        // Clear cart dan redirect ke halaman sukses
        clearCart();
        router.push(`/order-success${result.orderIds ? `?orderIds=${result.orderIds.join(',')}` : ""}`);
      } else {
        throw new Error(result.error || "Terjadi kesalahan saat memproses pesanan");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Terjadi kesalahan. Silakan coba lagi.";
      setSubmitError(errorMessage);
      console.error("Order submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag size={64} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Keranjang Kosong</h2>
          <p className="text-gray-600 mb-6">Belum ada item di keranjang Anda</p>
          <button
            onClick={() => router.push("/")}
            className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Kembali ke Menu
          </button>
        </div>
      </div>
    );
  }

  const isFormValid = customerInfo.name.trim() && 
                     customerInfo.phone.trim() && 
                     customerInfo.address.trim() && 
                     customerInfo.email.trim();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-2xl font-bold text-amber-900">Checkout</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items & Customer Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Error Message */}
            {submitError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 text-sm">{submitError}</p>
              </div>
            )}

            {/* Cart Items */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-amber-900 mb-4">Pesanan Anda</h2>
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                    <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg overflow-hidden">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white text-xs">
                          No Image
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{item.name}</h3>
                      <p className="text-sm text-gray-600">{formatCurrency(item.price)}</p>
                      {item.desc && (
                        <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="font-semibold">{formatCurrency(item.price * item.quantity)}</p>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-700 mt-1"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Customer Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-amber-900 mb-4">Informasi Pengiriman</h2>
              <form onSubmit={handleSubmitOrder} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nama Lengkap *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={customerInfo.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="Masukkan nama lengkap"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nomor Telepon *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={customerInfo.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="08xxxxxxxxxx"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={customerInfo.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="email@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nomor meja*</label>
                  <textarea
                    name="address"
                    value={customerInfo.address}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Masukkan nomor meja"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Catatan Tambahan</label>
                  <textarea
                    name="notes"
                    value={customerInfo.notes}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Contoh: Jangan ketuk pintu, hubungi saat sampai"
                  />
                </div>
              </form>
            </div>
          </div>

          {/* Ringkasan Pesanan */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
              <h2 className="text-xl font-bold text-amber-900 mb-4">Ringkasan Pesanan</h2>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span>Subtotal ({cartItems.length} item)</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Biaya Pengiriman</span>
                  <span>{formatCurrency(deliveryFee)}</span>
                </div>
                <hr />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-amber-600">{formatCurrency(total)}</span>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-2">
                  Pembayaran: <span className="font-semibold">Bayar di Tempat (COD)</span>
                </p>
                <p className="text-xs text-gray-500">
                  Pembayaran dilakukan saat pesanan diterima
                </p>
              </div>

              <button
                onClick={handleSubmitOrder}
                disabled={isSubmitting || !isFormValid}
                className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold transition-colors"
              >
                {isSubmitting ? "Memproses..." : `Pesan Sekarang - ${formatCurrency(total)}`}
              </button>

              <p className="text-xs text-gray-500 mt-2 text-center">
                Dengan memesan, Anda menyetujui syarat dan ketentuan kami
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}