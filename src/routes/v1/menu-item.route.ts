import { Router } from 'express';
import { menuItemController } from '@/controllers/menu-item.controller';
import { validate, validators } from '@/middlewares/validate';

export const menuItemRoutes = Router();

// Validation schemas
const createMenuItemSchema = {
  body: (data: any) => {
    const errors: string[] = [];
    
    const err1 = validators.required(data.name, 'name');
    if (err1) errors.push(err1);
    
    const err2 = validators.isString(data.name, 'name');
    if (err2) errors.push(err2);
    
    if (data.name && data.name.length > 100) {
      errors.push(validators.maxLength(data.name, 100, 'name') || '');
    }
    
    const err3 = validators.required(data.price, 'price');
    if (err3) errors.push(err3);
    
    const err4 = validators.isNumber(data.price, 'price');
    if (err4) errors.push(err4);
    
    if (data.price !== undefined) {
      const err5 = validators.isPositive(data.price, 'price');
      if (err5) errors.push(err5);
    }
    
    const err6 = validators.required(data.type, 'type');
    if (err6) errors.push(err6);
    
    const err7 = validators.isEnum(data.type, ['food', 'drink'], 'type');
    if (err7) errors.push(err7);
    
    if (data.category !== undefined && data.category !== null) {
      const err8 = validators.isString(data.category, 'category');
      if (err8) errors.push(err8);
      if (data.category && data.category.length > 100) {
        errors.push(validators.maxLength(data.category, 100, 'category') || '');
      }
    }
    
    return { valid: errors.length === 0, errors };
  },
};

const updateMenuItemSchema = {
  body: (data: any) => {
    const errors: string[] = [];
    
    if (data.name !== undefined) {
      const err1 = validators.isString(data.name, 'name');
      if (err1) errors.push(err1);
      if (data.name.length > 100) {
        errors.push(validators.maxLength(data.name, 100, 'name') || '');
      }
    }
    
    if (data.price !== undefined) {
      const err2 = validators.isNumber(data.price, 'price');
      if (err2) errors.push(err2);
      const err3 = validators.isPositive(data.price, 'price');
      if (err3) errors.push(err3);
    }
    
    if (data.type !== undefined) {
      const err4 = validators.isEnum(data.type, ['food', 'drink'], 'type');
      if (err4) errors.push(err4);
    }
    
    if (data.category !== undefined && data.category !== null) {
      const err5 = validators.isString(data.category, 'category');
      if (err5) errors.push(err5);
      if (data.category && data.category.length > 100) {
        errors.push(validators.maxLength(data.category, 100, 'category') || '');
      }
    }
    
    return { valid: errors.length === 0, errors };
  },
};

// Routes
menuItemRoutes.get('/grouped/by-category', menuItemController.getGroupedByCategory);
menuItemRoutes.get('/', menuItemController.getAll);
menuItemRoutes.get('/:id', menuItemController.getById);
menuItemRoutes.post('/', validate(createMenuItemSchema), menuItemController.create);
menuItemRoutes.put('/:id', validate(updateMenuItemSchema), menuItemController.update);
menuItemRoutes.delete('/:id', menuItemController.delete);
