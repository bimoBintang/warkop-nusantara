"use client";

import { useState } from 'react';
import { useCart } from '@/components/cartContext';
import { formatCurrency } from '@/lib/utils';
import { Plus, Minus, ShoppingCart, Search, Filter } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'react-hot-toast';

interface Product {
  id: string;
  name: string;
  price: number;
  desc?: string | null;
  image?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface MenuListProps {
  products: Product[];
}

type PriceFilter = 'all' | 'low' | 'medium' | 'high';
type SortBy = 'name' | 'price' | 'newest';

export function MenuList({ products }: MenuListProps) {
  const { addToCart, getCartItemQuantity } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState<PriceFilter>('all');
  const [sortBy, setSortBy] = useState<SortBy>('name');

  const filteredProducts = products.filter(product => {
    const lowerSearch = searchTerm.toLowerCase();
    const matchesSearch =
      product.name.toLowerCase().includes(lowerSearch) ||
      product.desc?.toLowerCase().includes(lowerSearch);

    let matchesPrice = true;
    if (priceFilter === 'low') matchesPrice = product.price < 50000;
    else if (priceFilter === 'medium') matchesPrice = product.price >= 50000 && product.price < 100000;
    else if (priceFilter === 'high') matchesPrice = product.price >= 100000;

    return matchesSearch && matchesPrice;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'price') return a.price - b.price;
    if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    return 0;
  });

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image ?? null,
      desc: product.desc ?? null,
      quantity: 1,
    });
    toast.success(`${product.name} ditambahkan ke keranjang!`);
  };

  const handleQuantityChange = (product: Product, quantity: number) => {
    const currentQuantity = getCartItemQuantity(product.id);
    const difference = quantity - currentQuantity;

    if (difference > 0) {
      for (let i = 0; i < difference; i++) {
        addToCart({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image ?? null,
          desc: product.desc ?? null,
          quantity: 1,
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-amber-900">Menu Kami</h1>
              <p className="text-gray-600 mt-1">Pilih makanan dan minuman favorit Anda</p>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Cari menu..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent w-full md:w-64"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filter:</span>
            </div>

            <select
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value as PriceFilter)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-amber-500"
            >
              <option value="all">Semua Harga</option>
              <option value="low">Di bawah Rp 50.000</option>
              <option value="medium">Rp 50.000 - Rp 100.000</option>
              <option value="high">Di atas Rp 100.000</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortBy)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-amber-500"
            >
              <option value="name">Urutkan A-Z</option>
              <option value="price">Harga Terendah</option>
              <option value="newest">Terbaru</option>
            </select>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <p className="text-gray-600">
            Menampilkan {sortedProducts.length} dari {products.length} menu
          </p>
        </div>

        {sortedProducts.length === 0 ? (
          <div className="text-center py-12">
            <Search size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Menu tidak ditemukan</h3>
            <p className="text-gray-500">Coba kata kunci lain atau ubah filter pencarian</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedProducts.map((product, index) => {
              const cartQuantity = getCartItemQuantity(product.id);
              return (
                <div key={product.id} className="rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
                  <div className="h-48 w-full relative group bg-gray-100">
                    {product.image ? (
                      <>
                        <Image
                          src={
                            product.image?.startsWith("http")
                              ? product.image
                              : product.image?.startsWith("/uploads/")
                                ? product.image
                                : `/uploads/${product.image}`
                          }
                          alt={product.name}
                          fill
                          sizes="(max-width: 768px) 100vw, 25vw"
                          className="object-cover transition-transform duration-200 group-hover:scale-105 rounded-t-lg z-0"
                          priority={index < 4}
                        />
                        <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-t-lg z-10" />
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white bg-gradient-to-br from-amber-400 to-amber-600">
                        <div className="text-center">
                          <ShoppingCart size={32} className="mx-auto mb-2" />
                          <span className="text-sm">No Image</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold text-lg text-gray-800 mb-1 line-clamp-2">
                      {product.name}
                    </h3>

                    <p className="text-xl font-bold text-amber-600 mb-2">
                      {formatCurrency(product.price)}
                    </p>

                    {product.desc && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {product.desc}
                      </p>
                    )}

                    <div className="flex items-center justify-between">
                      {cartQuantity === 0 ? (
                        <button
                          onClick={() => handleAddToCart(product)}
                          className="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
                        >
                          <Plus size={16} />
                          Tambah
                        </button>
                      ) : (
                        <div className="flex-1 flex items-center justify-between bg-gray-100 rounded-lg p-1">
                          <button
                            onClick={() => handleQuantityChange(product, cartQuantity - 1)}
                            className="p-1 hover:bg-gray-200 rounded-md transition-colors"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="font-semibold px-3">{cartQuantity}</span>
                          <button
                            onClick={() => handleQuantityChange(product, cartQuantity + 1)}
                            className="p-1 hover:bg-gray-200 rounded-md transition-colors"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
