import { Product } from '@/types'
import { Coffee, Clock } from 'lucide-react'
import Image from 'next/image'

interface MenuCardProps {
  item: Product
}

export default function MenuCard({ item }: MenuCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price)
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative">
        {item.image ? (
          <Image
            src={item.image} 
            alt={item.name}
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-amber-100 to-orange-200 flex items-center justify-center">
            <Coffee className="w-16 h-16 text-amber-600" />
          </div>
        )}
        
        {!item.available && (
          <div className="absolute inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
            <div className="bg-red-500 text-white px-4 py-2 rounded-full flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Tidak Tersedia
            </div>
          </div>
        )}
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{item.name}</h3>
        {item.desc && (
          <p className="text-gray-600 text-sm mb-4">{item.desc}</p>
        )}
        
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-amber-600">
            {formatPrice(item.price)}
          </span>
        </div>
      </div>
    </div>
  )
}