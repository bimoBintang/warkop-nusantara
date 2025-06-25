"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Types yang sesuai dengan model Prisma
export interface Product {
  id: string;
  name: string;
  price: number;
  desc: string | null;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem {
  id: string; // ID dari product
  name: string;
  price: number;
  desc: string | null;
  image: string | null;
  quantity: number;
}

export interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  clearCart: () => void;
  isInCart: (productId: string) => boolean;
  getCartItem: (productId: string) => CartItem | undefined;
}

// Create context dengan default values
const CartContext = createContext<CartContextType>({
  cartItems: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  getTotalItems: () => 0,
  getTotalPrice: () => 0,
  clearCart: () => {},
  isInCart: () => false,
  getCartItem: () => undefined,
});

// Cart Provider Component
interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart dari localStorage saat component mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('shopping-cart');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        console.log('Loaded cart from localStorage:', parsedCart);
        setCartItems(parsedCart);
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save cart ke localStorage setiap kali cartItems berubah
  useEffect(() => {
    if (isLoaded) {
      try {
        console.log('Saving cart to localStorage:', cartItems);
        localStorage.setItem('shopping-cart', JSON.stringify(cartItems));
      } catch (error) {
        console.error('Error saving cart to localStorage:', error);
      }
    }
  }, [cartItems, isLoaded]);

  const addToCart = (product: Product) => {
    console.log('Adding product to cart:', product);
    console.log('Current cart items:', cartItems);
    
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      console.log('Existing item found:', existingItem);
      
      if (existingItem) {
        console.log('Product already exists, increasing quantity');
        const updatedCart = prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        console.log('Updated cart:', updatedCart);
        return updatedCart;
      }
      
      // Convert Product ke CartItem
      const newCartItem: CartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        desc: product.desc,
        image: product.image,
        quantity: 1
      };
      
      console.log('Adding new item to cart:', newCartItem);
      const newCart = [...prev, newCartItem];
      console.log('New cart:', newCart);
      return newCart;
    });
  };

  const removeFromCart = (productId: string) => {
    console.log('Removing product from cart:', productId);
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    console.log('Updating quantity:', productId, quantity);
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.id === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };
  
  const clearCart = () => {
    console.log('Clearing cart');
    setCartItems([]);
  };

  const isInCart = (productId: string) => {
    return cartItems.some(item => item.id === productId);
  };

  const getCartItem = (productId: string) => {
    return cartItems.find(item => item.id === productId);
  };

  const value: CartContextType = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    getTotalItems,
    getTotalPrice,
    clearCart,
    isInCart,
    getCartItem,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook untuk menggunakan cart context
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};