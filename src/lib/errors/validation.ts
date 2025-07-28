// lib/errors/validation.ts
export class ValidationError extends Error {
  constructor(message: string, public errors: string[]) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class ProductNotFoundError extends Error {
  constructor(id: string) {
    super(`Product with ID ${id} not found`);
    this.name = 'ProductNotFoundError';
  }
}

export class DuplicateProductError extends Error {
  constructor(name: string) {
    super(`Product with name "${name}" already exists`);
    this.name = 'DuplicateProductError';
  }
}

export class ProductHasOrdersError extends Error {
  constructor(id: string) {
    super(`Cannot delete product ${id} because it has existing orders`);
    this.name = 'ProductHasOrdersError';
  }
}