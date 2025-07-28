import { MenuItem } from "@/components/menuItem";
import { ChevronDown, Clock, Coffee, MapPin } from "lucide-react";
import Image from "next/image";
import {prisma }from "@/lib/prisma"
import { CartButton } from "@/components/cartButton";
import Link from "next/link";
import { getProducts } from "@/lib/action/product";

export default async function Home() {
  const product = await getProducts();
  return (
    <main>
      <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-900/80 to-amber-800/60 z-10"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')`
          }}
        ></div>
        
        <div className="relative z-20 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
            Warkop <span className="text-amber-300">Bangboy</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Nikmati berbagai menu spesial yang pernah tercipta dari Warkop BangBoy
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/menu-list" className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-full font-semibold transition-colors transform hover:scale-105">
              Lihat Menu
            </Link>
            <Link href="#about" className="border-2 border-white text-white hover:bg-white hover:text-amber-900 px-8 py-3 rounded-full font-semibold transition-all transform hover:scale-105">
              Tentang Kami
            </Link>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
          <ChevronDown className="h-8 w-8 text-white animate-bounce" />
        </div>
      </section>
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg bg-amber-50 hover:shadow-lg transition-shadow">
              <Coffee className="h-16 w-16 text-amber-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Kopi Premium</h3>
              <p className="text-gray-600">Berbagai Macam Rasa</p>
            </div>
            <div className="text-center p-6 rounded-lg bg-amber-50 hover:shadow-lg transition-shadow">
              <Clock className="h-16 w-16 text-amber-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Buka 24 Jam</h3>
              <p className="text-gray-600">Melayani Anda kapan saja, setiap hari</p>
            </div>
            <div className="text-center p-6 rounded-lg bg-amber-50 hover:shadow-lg transition-shadow">
              <MapPin className="h-16 w-16 text-amber-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Lokasi Strategis</h3>
              <p className="text-gray-600">Mudah dijangkau dari berbagai arah</p>
            </div>
          </div>
        </div>  
      </section>
        <MenuItem menuItems={product} />
        <CartButton />
      <section id="about" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-amber-900 mb-6">Tentang Warkop Bangboy</h2>
              <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                Sejak tahun 2018, Warkop BangBoy telah menjadi tempat berkumpul favorit remaja. Kami
                bangga menyajikan menu dengan cita rasa yang autentik, suasana yang hangat
                bersahabat dan tidak lupa dengan budget pelajar.
              </p>
              <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                Dengan di dirikannya Warkop BangBoy, kami berkomitmen untuk memberikan
                pengalaman yang tidak terlupakan untuk bersantai dengan teman hingga keluarga bagi
                setiap pelanggan.
              </p>
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-amber-600">6+</div>
                  <div className="text-gray-600">Tahun Berpengalaman</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-amber-600">1K+</div>
                  <div className="text-gray-600">Pelanggan Puas</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-amber-600">10+</div>
                  <div className="text-gray-600">Varian Menu</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="rounded-lg overflow-hidden shadow-2xl">
                <Image 
                  src="https://images.unsplash.com/photo-1442512595331-e89e73853f31?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Interior Warkop" 
                  className="w-full h-96 object-cover"
                  width={250}
                  height={250}
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-amber-600 text-white p-6 rounded-lg shadow-lg">
                <div className="text-2xl font-bold">★ 4.8</div>
                <div className="text-sm">Rating Pelanggan</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
