"use client";

import { useRouter } from "next/navigation";
import { CheckCircle, ArrowLeft, Phone, MessageCircle } from "lucide-react";
import { useState, useEffect } from "react";

export default function OrderSuccess() {
  const router = useRouter();
  const [orderId, setOrderId] = useState<string | null>();

  useEffect(() => {
    const generatedId = Date.now().toString().slice(-6);
    setOrderId(generatedId);
  }, []);

  if (!orderId) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          {/* Success Icon */}
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>

          {/* Success Message */}
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Pesanan Berhasil!
          </h1>
          <p className="text-gray-600 mb-6">
            Terima kasih atas pesanan Anda. Kami akan menghubungi Anda segera untuk konfirmasi.
          </p>

          {/* Order Info */}
          <div className="bg-amber-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-amber-800 mb-2">
              <strong>Nomor Pesanan:</strong> #ORD-{orderId}
            </p>
            <p className="text-sm text-amber-800">
              <strong>Estimasi:</strong> 30-45 menit
            </p>
          </div>

          {/* Contact Info */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
              <Phone size={16} />
              <span>Kami akan menghubungi: +62 xxx-xxx-xxxx</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
              <MessageCircle size={16} />
              <span>Atau chat WhatsApp untuk update pesanan</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => router.push('/')}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-lg transition-colors font-medium"
            >
              Kembali ke Menu
            </button>
            
            <button
              onClick={() => router.back()}
              className="w-full flex items-center justify-center gap-2 text-amber-600 hover:text-amber-700 py-2 transition-colors"
            >
              <ArrowLeft size={16} />
              <span>Kembali</span>
            </button>
          </div>

          {/* Footer Note */}
          <p className="text-xs text-gray-500 mt-6">
            Butuh bantuan? Hubungi kami di{' '}
            <a href="tel:+62xxx" className="text-amber-600 hover:underline">
              +62 xxx-xxx-xxxx
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}