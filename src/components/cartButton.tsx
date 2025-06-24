"use client";

import { ShoppingCart } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/components/cartContext";
import { useRouter } from "next/navigation";

export const CartButton = () => {
  const { getTotalItems } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const cartCount = getTotalItems();
  
  const router = useRouter();

  const handleCartClick = () => {
    console.log("Keranjang diklik");
    router.push("/checkout");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={handleCartClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          relative
          w-16 h-16
          bg-amber-600 hover:bg-amber-700
          text-white
          rounded-full
          shadow-lg hover:shadow-xl
          transition-all duration-300 ease-in-out
          transform hover:scale-110
          flex items-center justify-center
          group
          ${isHovered ? 'animate-pulse' : ''}
        `}
      >
        {/* Cart Icon */}
        <ShoppingCart 
          size={24} 
          className="transition-transform duration-200 group-hover:scale-110" 
        />
        
        {/* Cart Count Badge */}
        {cartCount > 0 && (
          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-bounce">
            {cartCount > 99 ? '99+' : cartCount}
          </div>
        )}
        
        {/* Ripple Effect */}
        <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-200"></div>
      </button>
      
      {/* Tooltip */}
      <div 
        className={`
          absolute bottom-full right-0 mb-2
          bg-gray-800 text-white text-sm
          px-3 py-1 rounded-lg
          whitespace-nowrap
          transition-all duration-200
          ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}
        `}
      >
        Keranjang ({cartCount})
        <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
      </div>
    </div>
  );
};