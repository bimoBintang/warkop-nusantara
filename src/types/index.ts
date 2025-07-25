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
    available?: boolean
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

  export interface Category {
  id: number
  name: string
  description?: string
  menuItems: MenuItem[]
  createdAt: Date
  updatedAt: Date
}

export interface MenuItem {
  id: number
  name: string
  description?: string
  price: number
  image?: string
  createdAt: Date
  updatedAt: Date
}