// lib/utils/error-handler.ts
import { 
  ValidationError, 
  ProductNotFoundError, 
  DuplicateProductError, 
  ProductHasOrdersError 
} from '@/lib/errors/validation';

export interface ErrorResponse {
  type: 'validation' | 'not_found' | 'duplicate' | 'has_orders' | 'server_error';
  message: string;
  details?: string[];
  field?: string; // For field-specific errors
}

export function handleProductError(error: unknown): ErrorResponse {
  if (error instanceof ValidationError) {
    return {
      type: 'validation',
      message: 'Validation failed',
      details: error.errors
    };
  }

  if (error instanceof ProductNotFoundError) {
    return {
      type: 'not_found',
      message: error.message
    };
  }

  if (error instanceof DuplicateProductError) {
    return {
      type: 'duplicate',
      message: error.message,
      field: 'name'
    };
  }

  if (error instanceof ProductHasOrdersError) {
    return {
      type: 'has_orders',
      message: error.message
    };
  }

  // Generic server error
  console.error('Unexpected error:', error);
  return {
    type: 'server_error',
    message: 'An unexpected error occurred. Please try again later.'
  };
}

// Toast notification helper
export function getErrorToastMessage(errorResponse: ErrorResponse): string {
  switch (errorResponse.type) {
    case 'validation':
      return errorResponse.details?.join(', ') || errorResponse.message;
    case 'not_found':
      return 'Product not found. It may have been deleted.';
    case 'duplicate':
      return 'This product name is already taken. Please choose a different name.';
    case 'has_orders':
      return 'Cannot delete this product because it has existing orders.';
    case 'server_error':
    default:
      return errorResponse.message;
  }
}

// Form field error mapper
export function mapErrorsToFields(errorResponse: ErrorResponse): Record<string, string> {
  const fieldErrors: Record<string, string> = {};

  if (errorResponse.type === 'validation' && errorResponse.details) {
    errorResponse.details.forEach(detail => {
      // Parse field-specific errors like "name: Product name is required"
      const colonIndex = detail.indexOf(':');
      if (colonIndex > 0) {
        const field = detail.substring(0, colonIndex).trim();
        const message = detail.substring(colonIndex + 1).trim();
        fieldErrors[field] = message;
      }
    });
  } else if (errorResponse.field) {
    fieldErrors[errorResponse.field] = errorResponse.message;
  }

  return fieldErrors;
}

// Success message helper
export function getSuccessMessage(action: 'create' | 'update' | 'delete', productName?: string): string {
  const name = productName ? `"${productName}"` : 'Product';
  
  switch (action) {
    case 'create':
      return `${name} has been created successfully!`;
    case 'update':
      return `${name} has been updated successfully!`;
    case 'delete':
      return `${name} has been deleted successfully!`;
    default:
      return 'Operation completed successfully!';
  }
}

// Retry helper for API calls
export async function retryOperation<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: unknown;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      
      // Don't retry validation errors or business logic errors
      if (error instanceof ValidationError || 
          error instanceof ProductNotFoundError || 
          error instanceof DuplicateProductError || 
          error instanceof ProductHasOrdersError) {
        throw error;
      }
      
      // If this is the last attempt, throw the error
      if (attempt === maxRetries) {
        throw error;
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }
  
  throw lastError;
}

// Loading state helper
export interface LoadingState {
  isLoading: boolean;
  error: ErrorResponse | null;
  success: string | null;
}

export function createLoadingState(): LoadingState {
  return {
    isLoading: false,
    error: null,
    success: null
  };
}

export function setLoading(state: LoadingState): LoadingState {
  return {
    ...state,
    isLoading: true,
    error: null,
    success: null
  };
}

export function setError(state: LoadingState, error: unknown): LoadingState {
  return {
    ...state,
    isLoading: false,
    error: handleProductError(error),
    success: null
  };
}

export function setSuccess(state: LoadingState, message: string): LoadingState {
  return {
    ...state,
    isLoading: false,
    error: null,
    success: message
  };
}

// Validation helper for client-side
export function validateField(field: string, value: string, required: boolean = false): string | null {
  if (required && !value.trim()) {
    return `${field} is required`;
  }

  switch (field.toLowerCase()) {
    case 'name':
      if (value && value.length < 2) {
        return 'Product name must be at least 2 characters';
      }
      if (value && value.length > 100) {
        return 'Product name must not exceed 100 characters';
      }
      break;

    case 'price':
      const price = Number(value);
      if (value && (isNaN(price) || price <= 0)) {
        return 'Price must be a positive number';
      }
      if (price > 999999999) {
        return 'Price is too high';
      }
      // Check decimal places
      if (value && value.includes('.')) {
        const decimals = value.split('.')[1];
        if (decimals && decimals.length > 2) {
          return 'Price can have maximum 2 decimal places';
        }
      }
      break;

    case 'desc':
    case 'description':
      if (value && value.length > 500) {
        return 'Description must not exceed 500 characters';
      }
      break;

    case 'image':
      if (value) {
        try {
          new URL(value);
          const imageExtensions = /\.(jpg|jpeg|png|gif|webp|svg)$/i;
          if (!imageExtensions.test(value)) {
            return 'Image URL must be a valid image file (jpg, jpeg, png, gif, webp, svg)';
          }
        } catch {
          return 'Invalid image URL format';
        }
        if (value.length > 2048) {
          return 'Image URL too long';
        }
      }
      break;
  }

  return null;
}