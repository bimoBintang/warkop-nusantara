import { z } from 'zod';

// Base product validation schema
export const ProductSchema = z.object({
  id: z.string().uuid('Invalid product ID format'),
  name: z.string()
    .min(1, 'Product name is required')
    .min(2, 'Product name must be at least 2 characters')
    .max(100, 'Product name must not exceed 100 characters')
    .trim(),
  price: z.number()
    .positive('Price must be greater than 0')
    .max(999999999, 'Price is too high')
    .refine((val) => {
      // Check if price has max 2 decimal places
      return Number.isInteger(val * 100);
    }, 'Price can have maximum 2 decimal places'),
  desc: z.string()
    .max(500, 'Description must not exceed 500 characters')
    .trim()
    .nullable()
    .optional(),
  image: z.string()
    .url('Invalid image URL format')
    .max(2048, 'Image URL too long')
    .nullable()
    .optional()
    .refine((url) => {
      if (!url) return true;
      // Check if URL ends with common image extensions
      const imageExtensions = /\.(jpg|jpeg|png|gif|webp|svg)$/i;
      return imageExtensions.test(url);
    }, 'Image URL must be a valid image file (jpg, jpeg, png, gif, webp, svg)'),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Create product validation (without id, createdAt, updatedAt)
export const CreateProductSchema = z.object({
  name: z.string()
    .min(1, 'Product name is required')
    .min(2, 'Product name must be at least 2 characters')
    .max(100, 'Product name must not exceed 100 characters')
    .trim(),
  price: z.number()
    .positive('Price must be greater than 0')
    .max(999999999, 'Price is too high')
    .refine((val) => {
      return Number.isInteger(val * 100);
    }, 'Price can have maximum 2 decimal places'),
  desc: z.string()
    .max(500, 'Description must not exceed 500 characters')
    .trim()
    .optional()
    .or(z.literal('')), // Allow empty string
  image: z.string()
    .url('Invalid image URL format')
    .max(2048, 'Image URL too long')
    .optional()
    .or(z.literal('')) // Allow empty string
    .refine((url) => {
      if (!url || url === '') return true;
      const imageExtensions = /\.(jpg|jpeg|png|gif|webp|svg)$/i;
      return imageExtensions.test(url);
    }, 'Image URL must be a valid image file (jpg, jpeg, png, gif, webp, svg)'),
});

// Update product validation (all fields optional)
export const UpdateProductSchema = z.object({
  name: z.string()
    .min(2, 'Product name must be at least 2 characters')
    .max(100, 'Product name must not exceed 100 characters')
    .trim()
    .optional(),
  price: z.number()
    .positive('Price must be greater than 0')
    .max(999999999, 'Price is too high')
    .refine((val) => {
      return Number.isInteger(val * 100);
    }, 'Price can have maximum 2 decimal places')
    .optional(),
  desc: z.string()
    .max(500, 'Description must not exceed 500 characters')
    .trim()
    .nullable()
    .optional(),
  image: z.string()
    .url('Invalid image URL format')
    .max(2048, 'Image URL too long')
    .nullable()
    .optional()
    .refine((url) => {
      if (!url) return true;
      const imageExtensions = /\.(jpg|jpeg|png|gif|webp|svg)$/i;
      return imageExtensions.test(url);
    }, 'Image URL must be a valid image file (jpg, jpeg, png, gif, webp, svg)'),
});

// Search products validation
export const SearchProductsSchema = z.object({
  query: z.string()
    .min(1, 'Search query is required')
    .max(100, 'Search query too long')
    .trim(),
});

// Price range validation
export const PriceRangeSchema = z.object({
  minPrice: z.number()
    .min(0, 'Minimum price cannot be negative')
    .max(999999999, 'Price is too high'),
  maxPrice: z.number()
    .min(0, 'Maximum price cannot be negative')
    .max(999999999, 'Price is too high'),
}).refine((data) => data.minPrice <= data.maxPrice, {
  message: 'Minimum price must be less than or equal to maximum price',
  path: ['minPrice'],
});

// Product ID validation
export const ProductIdSchema = z.object({
  id: z.string().uuid('Invalid product ID format'),
});

// Client-side form validation schemas (for forms with string inputs)
export const CreateProductFormSchema = z.object({
  name: z.string()
    .min(1, 'Product name is required')
    .min(2, 'Product name must be at least 2 characters')
    .max(100, 'Product name must not exceed 100 characters')
    .trim(),
  price: z.string()
    .min(1, 'Price is required')
    .refine((val) => !isNaN(Number(val)), 'Price must be a valid number')
    .refine((val) => Number(val) > 0, 'Price must be greater than 0')
    .refine((val) => Number(val) <= 999999999, 'Price is too high')
    .refine((val) => {
      const num = Number(val);
      return Number.isInteger(num * 100);
    }, 'Price can have maximum 2 decimal places')
    .transform((val) => Number(val)),
  desc: z.string()
    .max(500, 'Description must not exceed 500 characters')
    .trim()
    .optional()
    .or(z.literal('')),
  image: z.string()
    .url('Invalid image URL format')
    .max(2048, 'Image URL too long')
    .optional()
    .or(z.literal(''))
    .refine((url) => {
      if (!url || url === '') return true;
      const imageExtensions = /\.(jpg|jpeg|png|gif|webp|svg)$/i;
      return imageExtensions.test(url);
    }, 'Image URL must be a valid image file (jpg, jpeg, png, gif, webp, svg)'),
});

export const UpdateProductFormSchema = z.object({
  name: z.string()
    .min(2, 'Product name must be at least 2 characters')
    .max(100, 'Product name must not exceed 100 characters')
    .trim()
    .optional(),
  price: z.string()
    .refine((val) => val === '' || !isNaN(Number(val)), 'Price must be a valid number')
    .refine((val) => val === '' || Number(val) > 0, 'Price must be greater than 0')
    .refine((val) => val === '' || Number(val) <= 999999999, 'Price is too high')
    .refine((val) => {
      if (val === '') return true;
      const num = Number(val);
      return Number.isInteger(num * 100);
    }, 'Price can have maximum 2 decimal places')
    .transform((val) => val === '' ? undefined : Number(val))
    .optional(),
  desc: z.string()
    .max(500, 'Description must not exceed 500 characters')
    .trim()
    .nullable()
    .optional(),
  image: z.string()
    .url('Invalid image URL format')
    .max(2048, 'Image URL too long')
    .nullable()
    .optional()
    .refine((url) => {
      if (!url) return true;
      const imageExtensions = /\.(jpg|jpeg|png|gif|webp|svg)$/i;
      return imageExtensions.test(url);
    }, 'Image URL must be a valid image file (jpg, jpeg, png, gif, webp, svg)'),
});

// Type inference from schemas
export type ProductValidation = z.infer<typeof ProductSchema>;
export type CreateProductValidation = z.infer<typeof CreateProductSchema>;
export type UpdateProductValidation = z.infer<typeof UpdateProductSchema>;
export type SearchProductsValidation = z.infer<typeof SearchProductsSchema>;
export type PriceRangeValidation = z.infer<typeof PriceRangeSchema>;
export type ProductIdValidation = z.infer<typeof ProductIdSchema>;
export type CreateProductFormValidation = z.infer<typeof CreateProductFormSchema>;
export type UpdateProductFormValidation = z.infer<typeof UpdateProductFormSchema>;

// Validation helper functions
export const validateProduct = (data: unknown) => {
  return ProductSchema.safeParse(data);
};

export const validateCreateProduct = (data: unknown) => {
  return CreateProductSchema.safeParse(data);
};

export const validateUpdateProduct = (data: unknown) => {
  return UpdateProductSchema.safeParse(data);
};

export const validateSearchProducts = (data: unknown) => {
  return SearchProductsSchema.safeParse(data);
};

export const validatePriceRange = (data: unknown) => {
  return PriceRangeSchema.safeParse(data);
};

export const validateProductId = (data: unknown) => {
  return ProductIdSchema.safeParse(data);
};

export const validateCreateProductForm = (data: unknown) => {
  return CreateProductFormSchema.safeParse(data);
};

export const validateUpdateProductForm = (data: unknown) => {
  return UpdateProductFormSchema.safeParse(data);
};