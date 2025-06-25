"use client";

import { useCart } from '@/components/cartContext';
import { useEffect, useState } from 'react';

export default function CartDebug() {
  const { cartItems, getTotalItems, getTotalPrice } = useCart();
  const [localCart, setLocalCart] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Tandai bahwa kita sudah di client
    setIsClient(true);

    // Ambil data dari localStorage
    const storedCart = localStorage.getItem('shopping-cart');
    if (storedCart) {
      setLocalCart(storedCart);
    }
  }, []);

  if (!isClient) {
    // Hindari render saat SSR (untuk mencegah hydration error)
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-80 text-white p-4 rounded-lg text-xs max-w-xs z-50 shadow-md">
      <h3 className="font-bold mb-2">🛒 Cart Debug</h3>
      <div className="space-y-1">
        <p>Items Count: {cartItems.length}</p>
        <p>Total Items: {getTotalItems()}</p>
        <p>Total Price: Rp {getTotalPrice().toLocaleString()}</p>
        <p className="break-words">localStorage: {localCart ?? 'Kosong / Loading...'}</p>
      </div>

      {cartItems.length > 0 && (
        <div className="mt-2">
          <p className="font-semibold">Items:</p>
          {cartItems.map((item, idx) => (
            <div key={item.id} className="text-xs">
              {idx + 1}. {item.name} (x{item.quantity})
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
