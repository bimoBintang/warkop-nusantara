"use client";

import Image from "next/image";
import { useCart, CartItem } from "@/components/cartContext";

interface MenuItemProps {
  menuItems: Partial<CartItem>[];
}

export const MenuItem = ({ menuItems }: MenuItemProps) => {
  const { addToCart } = useCart();

  const handleAddToCart = (item: Partial<CartItem>) => {
    // Validasi minimal property
    if (!item.id || !item.name || typeof item.price !== "number") {
      console.error("Produk tidak valid:", item);
      return;
    }

    // Buat objek Product lengkap
    const newProduct: CartItem = {
      id: item.id,
      name: item.name,
      price: item.price,
      desc: item.desc ?? null,
      image: item.image ?? null,
      quantity: 1,
    };

    addToCart(newProduct);
    console.log(`${item.name} ditambahkan ke keranjang`);
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <section id="menu" className="py-20 bg-amber-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-amber-900 mb-4">Menu Spesial Kami</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Koleksi minuman kopi terbaik dengan cita rasa autentik Indonesia
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {menuItems.map((item, index) => (
            <div
              key={item.id ?? index}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="h-48 bg-gradient-to-br from-amber-400 to-amber-600 relative overflow-hidden">
                {item.image ? (
                  <Image
                    className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                    src={
                      item.image?.startsWith("http")
                      ? item.image
                      : item.image?.startsWith("/uploads/")
                        ? item.image
                        : `/uploads/${item.image}`
                    }
                    alt={item.name ?? "Menu item"}
                    width={400}
                    height={192}
                    priority={index < 3}
                  />
                ) : (
                  <div className="w-full h-48 flex items-center justify-center text-white font-semibold text-lg">
                    No Image Available
                  </div>
                )}
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-amber-900 line-clamp-2">
                    {item.name ?? "Tanpa Nama"}
                  </h3>
                  <span className="text-lg font-bold text-amber-600 ml-2 whitespace-nowrap">
                    {formatPrice(item.price ?? 0)}
                  </span>
                </div>

                <p className="text-gray-600 mb-4 line-clamp-3">
                  {item.desc ?? "Deskripsi tidak tersedia"}
                </p>

                <button
                  onClick={() => handleAddToCart(item)}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 font-medium"
                >
                  Tambah ke Keranjang
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
