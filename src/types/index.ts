export interface User {
    id: string
    email: string
    name: string
    createdAt: Date
    updatedAt: Date
  }
  
  export interface Product {
    id: string
    name: string
    price: number
    desc?: string | null
    image?: string | null
    createdAt: Date
    updatedAt: Date
  }
  
  export interface CreateUserData {
    email: string
    name: string
    password: string
  }
  
  export interface CreateProductData {
    name: string
    price: number
    desc?: string
    image?: string
  }