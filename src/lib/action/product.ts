'use server'; 
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export interface Product {
  id: string;
  name: string;
  price: number;
  desc?: string | null;
  image?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProductData {
  name: string;
  price: number;
  desc?: string;
  image?: string;
}

export interface UpdateProductData {
  name?: string;
  price?: number;
  desc?: string;
  image?: string;
}

// Get all products
export async function getProducts(): Promise<Product[]> {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw new Error('Failed to fetch products');
  }
}

// Get product by ID
export async function getProductById(id: string): Promise<Product | null> {
  try {
    const product = await prisma.product.findUnique({
      where: { id }
    });
    return product;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw new Error('Failed to fetch product');
  }
}

// Create new product
export async function createProduct(data: CreateProductData): Promise<Product> {
  try {
    const product = await prisma.product.create({
      data: {
        name: data.name,
        price: data.price,
        desc: data.desc,
        image: data.image
      }
    });
    
    revalidatePath('/menu-list');
    return product;
  } catch (error) {
    console.error('Error creating product:', error);
    throw new Error('Failed to create product');
  }
}

// Update product
export async function updateProduct(id: string, data: UpdateProductData): Promise<Product> {
  try {
    const product = await prisma.product.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.price && { price: data.price }),
        ...(data.desc !== undefined && { desc: data.desc }),
        ...(data.image !== undefined && { image: data.image })
      }
    });
    
    revalidatePath('/menu-list');
    return product;
  } catch (error) {
    console.error('Error updating product:', error);
    throw new Error('Failed to update product');
  }
}

// Delete product
export async function deleteProduct(id: string): Promise<void> {
  try {
    // Check if product has any orders
    const ordersCount = await prisma.order.count({
      where: { productId: id }
    });
    
    if (ordersCount > 0) {
      throw new Error('Cannot delete product that has orders');
    }
    
    await prisma.product.delete({
      where: { id }
    });
    
    revalidatePath('/menu-list');
  } catch (error) {
    console.error('Error deleting product:', error);
    throw new Error('Failed to delete product');
  }
}

// Search products
export async function searchProducts(query: string): Promise<Product[]> {
  try {
    const products = await prisma.product.findMany({
      where: {
        OR: [
          {
            name: {
              contains: query,
              mode: 'insensitive'
            }
          },
          {
            desc: {
              contains: query,
              mode: 'insensitive'
            }
          }
        ]
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return products;
  } catch (error) {
    console.error('Error searching products:', error);
    throw new Error('Failed to search products');
  }
}

// Get products by price range
export async function getProductsByPriceRange(minPrice: number, maxPrice: number): Promise<Product[]> {
  try {
    const products = await prisma.product.findMany({
      where: {
        price: {
          gte: minPrice,
          lte: maxPrice
        }
      },
      orderBy: {
        price: 'asc'
      }
    });
    
    return products;
  } catch (error) {
    console.error('Error fetching products by price range:', error);
    throw new Error('Failed to fetch products by price range');
  }
}