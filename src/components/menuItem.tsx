"use client";

import Image from "next/image";

interface menuProductProps {
  menuItems: {
    image: string | null;
    name: string;
    price: number;
    desc: string | null;
  }[];
}

export const MenuItem = ({menuItems}:menuProductProps)=> {
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
              <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="h-48 bg-gradient-to-br from-amber-400 to-amber-600">
                  <Image src={item.image || ''} alt={item.name} width={150} height={150} />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-amber-900">{item.name}</h3>
                    <span className="text-lg font-bold text-amber-600">{item.price}</span>
                  </div>
                  <p className="text-gray-600 mb-4">{item.desc}</p>
                  <button className="w-full bg-amber-600 hover:bg-amber-700 text-white py-2 rounded-lg transition-colors">
                    Pesan Sekarang
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
}