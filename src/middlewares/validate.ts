import type { Request, Response, NextFunction } from 'express';
import { ValidationError } from '@/utils/errors';

type ValidationSchema = {
  body?: (data: any) => { valid: boolean; errors?: string[] };
  query?: (data: any) => { valid: boolean; errors?: string[] };
  params?: (data: any) => { valid: boolean; errors?: string[] };
};

export const validate = (schema: ValidationSchema) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const errors: string[] = [];

    if (schema.body) {
      const result = schema.body(req.body);
      if (!result.valid && result.errors) {
        errors.push(...result.errors);
      }
    }

    if (schema.query) {
      const result = schema.query(req.query);
      if (!result.valid && result.errors) {
        errors.push(...result.errors);
      }
    }

    if (schema.params) {
      const result = schema.params(req.params);
      if (!result.valid && result.errors) {
        errors.push(...result.errors);
      }
    }

    if (errors.length > 0) {
      throw new ValidationError(errors.join(', '));
    }

    next();
  };
};

// Simple validators
export const validators = {
  required: (value: any, fieldName: string): string | null => {
    if (value === undefined || value === null || value === '') {
      return `${fieldName} is required`;
    }
    return null;
  },

  isNumber: (value: any, fieldName: string): string | null => {
    if (isNaN(Number(value))) {
      return `${fieldName} must be a number`;
    }
    return null;
  },

  isPositive: (value: any, fieldName: string): string | null => {
    if (Number(value) <= 0) {
      return `${fieldName} must be positive`;
    }
    return null;
  },

  isString: (value: any, fieldName: string): string | null => {
    if (typeof value !== 'string') {
      return `${fieldName} must be a string`;
    }
    return null;
  },

  maxLength: (value: string, max: number, fieldName: string): string | null => {
    if (value.length > max) {
      return `${fieldName} must be at most ${max} characters`;
    }
    return null;
  },

  isEnum: (value: any, enumValues: string[], fieldName: string): string | null => {
    if (!enumValues.includes(value)) {
      return `${fieldName} must be one of: ${enumValues.join(', ')}`;
    }
    return null;
  },
};
