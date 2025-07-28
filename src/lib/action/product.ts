'use server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import {
  ProductSchema,
  validateCreateProduct,
  validateUpdateProduct,
  validateSearchProducts,
  validatePriceRange,
  validateProductId,
} from '@/types/validation';
import {
  ValidationError,
  ProductNotFoundError,
  DuplicateProductError,
  ProductHasOrdersError
} from '@/lib/errors/validation';

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
    
    // Validate each product before returning
    const validatedProducts = products.map(product => {
      const validation = ProductSchema.safeParse(product);
      if (!validation.success) {
        console.warn(`Invalid product data for ID ${product.id}:`, validation.error.issues);
        // Return product as-is but log the warning
      }
      return product;
    });
    
    return validatedProducts;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw new Error('Failed to fetch products');
  }
}

// Get product by ID
export async function getProductById(id: string): Promise<Product | null> {
  try {
    // Validate ID first
    const idValidation = validateProductId({ id });
    if (!idValidation.success) {
      throw new ValidationError(
        'Invalid product ID',
        idValidation.error.issues.map(issue => issue.message)
      );
    }

    const product = await prisma.product.findUnique({
      where: { id }
    });
    
    if (product) {
      // Validate product data
      const validation = ProductSchema.safeParse(product);
      if (!validation.success) {
        console.warn(`Invalid product data for ID ${id}:`, validation.error.issues);
      }
    }
    
    return product;
  } catch (error) {
    if (error instanceof ValidationError) {
      throw error;
    }
    console.error('Error fetching product:', error);
    throw new Error('Failed to fetch product');
  }
}

// Create new product
export async function createProduct(data: CreateProductData): Promise<Product> {
  try {
    // Validate input data
    const validation = validateCreateProduct(data);
    if (!validation.success) {
      throw new ValidationError(
        'Invalid product data',
        validation.error.issues.map(issue => `${issue.path.join('.')}: ${issue.message}`)
      );
    }

    const validatedData = validation.data;

    // Check if product with same name already exists
    const existingProduct = await prisma.product.findFirst({
      where: {
        name: {
          equals: validatedData.name,
          mode: 'insensitive'
        }
      }
    });

    if (existingProduct) {
      throw new DuplicateProductError(validatedData.name);
    }

    const product = await prisma.product.create({
      data: {
        name: validatedData.name,
        price: validatedData.price,
        desc: validatedData.desc || null,
        image: validatedData.image || null
      }
    });
    
    revalidatePath('/menu-list');
    return product;
  } catch (error) {
    if (error instanceof ValidationError || 
        error instanceof DuplicateProductError) {
      throw error;
    }
    console.error('Error creating product:', error);
    throw new Error('Failed to create product');
  }
}

// Update product
export async function updateProduct(id: string, data: UpdateProductData): Promise<Product> {
  try {
    // Validate ID first
    const idValidation = validateProductId({ id });
    if (!idValidation.success) {
      throw new ValidationError(
        'Invalid product ID',
        idValidation.error.issues.map(issue => issue.message)
      );
    }

    // Validate update data
    const validation = validateUpdateProduct(data);
    if (!validation.success) {
      throw new ValidationError(
        'Invalid update data',
        validation.error.issues.map(issue => `${issue.path.join('.')}: ${issue.message}`)
      );
    }

    const validatedData = validation.data;

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id }
    });

    if (!existingProduct) {
      throw new ProductNotFoundError(id);
    }

    // Check if name is being updated and if it conflicts with another product
    if (validatedData.name && validatedData.name !== existingProduct.name) {
      const nameConflict = await prisma.product.findFirst({
        where: {
          name: {
            equals: validatedData.name,
            mode: 'insensitive'
          },
          id: {
            not: id
          }
        }
      });

      if (nameConflict) {
        throw new DuplicateProductError(validatedData.name);
      }
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...(validatedData.name && { name: validatedData.name }),
        ...(validatedData.price !== undefined && { price: validatedData.price }),
        ...(validatedData.desc !== undefined && { desc: validatedData.desc }),
        ...(validatedData.image !== undefined && { image: validatedData.image })
      }
    });
    
    revalidatePath('/menu-list');
    return product;
  } catch (error) {
    if (error instanceof ValidationError || 
        error instanceof ProductNotFoundError || 
        error instanceof DuplicateProductError) {
      throw error;
    }
    console.error('Error updating product:', error);
    throw new Error('Failed to update product');
  }
}

// Delete product
export async function deleteProduct(id: string): Promise<void> {
  try {
    // Validate ID first
    const idValidation = validateProductId({ id });
    if (!idValidation.success) {
      throw new ValidationError(
        'Invalid product ID',
        idValidation.error.issues.map(issue => issue.message)
      );
    }

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id }
    });

    if (!existingProduct) {
      throw new ProductNotFoundError(id);
    }

    // Check if product has any orders
    const ordersCount = await prisma.order.count({
      where: { productId: id }
    });
    
    if (ordersCount > 0) {
      throw new ProductHasOrdersError(id);
    }
    
    await prisma.product.delete({
      where: { id }
    });
    
    revalidatePath('/menu-list');
  } catch (error) {
    if (error instanceof ValidationError || 
        error instanceof ProductNotFoundError || 
        error instanceof ProductHasOrdersError) {
      throw error;
    }
    console.error('Error deleting product:', error);
    throw new Error('Failed to delete product');
  }
}

// Search products
export async function searchProducts(query: string): Promise<Product[]> {
  try {
    // Validate search query
    const validation = validateSearchProducts({ query });
    if (!validation.success) {
      throw new ValidationError(
        'Invalid search query',
        validation.error.issues.map(issue => issue.message)
      );
    }

    const validatedQuery = validation.data.query;

    const products = await prisma.product.findMany({
      where: {
        OR: [
          {
            name: {
              contains: validatedQuery,
              mode: 'insensitive'
            }
          },
          {
            desc: {
              contains: validatedQuery,
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
    if (error instanceof ValidationError) {
      throw error;
    }
    console.error('Error searching products:', error);
    throw new Error('Failed to search products');
  }
}

// Get products by price range
export async function getProductsByPriceRange(minPrice: number, maxPrice: number): Promise<Product[]> {
  try {
    // Validate price range
    const validation = validatePriceRange({ minPrice, maxPrice });
    if (!validation.success) {
      throw new ValidationError(
        'Invalid price range',
        validation.error.issues.map(issue => issue.message)
      );
    }

    const { minPrice: validMinPrice, maxPrice: validMaxPrice } = validation.data;

    const products = await prisma.product.findMany({
      where: {
        price: {
          gte: validMinPrice,
          lte: validMaxPrice
        }
      },
      orderBy: {
        price: 'asc'
      }
    });
    
    return products;
  } catch (error) {
    if (error instanceof ValidationError) {
      throw error;
    }
    console.error('Error fetching products by price range:', error);
    throw new Error('Failed to fetch products by price range');
  }
}

// Bulk create products (with validation)
export async function bulkCreateProducts(products: CreateProductData[]): Promise<Product[]> {
  try {
    // Validate all products first
    const validationResults = products.map(product => validateCreateProduct(product));
    const errors: string[] = [];
    
    validationResults.forEach((result, index) => {
      if (!result.success) {
        errors.push(`Product ${index + 1}: ${result.error.issues.map(issue => issue.message).join(', ')}`);
      }
    });

    if (errors.length > 0) {
      throw new ValidationError('Bulk validation failed', errors);
    }

    const validatedProducts = validationResults.map(result => result.data!);

    // Check for duplicate names within the batch
    const names = validatedProducts.map(p => p.name.toLowerCase());
    const duplicates = names.filter((name, index) => names.indexOf(name) !== index);
    
    if (duplicates.length > 0) {
      throw new ValidationError(
        'Duplicate names in batch',
        [`Duplicate product names found: ${[...new Set(duplicates)].join(', ')}`]
      );
    }

    // Check for existing products with same names
    const existingProducts = await prisma.product.findMany({
      where: {
        name: {
          in: validatedProducts.map(p => p.name),
          mode: 'insensitive'
        }
      }
    });

    if (existingProducts.length > 0) {
      throw new ValidationError(
        'Products already exist',
        [`Products with these names already exist: ${existingProducts.map(p => p.name).join(', ')}`]
      );
    }

    // Create all products
    const createdProducts = await prisma.$transaction(
      validatedProducts.map(product =>
        prisma.product.create({
          data: {
            name: product.name,
            price: product.price,
            desc: product.desc || null,
            image: product.image || null
          }
        })
      )
    );

    revalidatePath('/menu-list');
    return createdProducts;
  } catch (error) {
    if (error instanceof ValidationError) {
      throw error;
    }
    console.error('Error bulk creating products:', error);
    throw new Error('Failed to bulk create products');
  }
}