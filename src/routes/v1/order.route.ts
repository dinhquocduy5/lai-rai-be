import { Router } from 'express';
import { orderController } from '@/controllers/order.controller';
import { validate, validators } from '@/middlewares/validate';

export const orderRoutes = Router();

// Validation schemas
const createOrderSchema = {
  body: (data: any) => {
    const errors: string[] = [];
    
    const err1 = validators.required(data.table_id, 'table_id');
    if (err1) errors.push(err1);
    
    const err2 = validators.isNumber(data.table_id, 'table_id');
    if (err2) errors.push(err2);
    
    if (data.table_id !== undefined) {
      const err3 = validators.isPositive(data.table_id, 'table_id');
      if (err3) errors.push(err3);
    }
    
    const err4 = validators.required(data.items, 'items');
    if (err4) errors.push(err4);
    
    if (!Array.isArray(data.items)) {
      errors.push('items must be an array');
    } else if (data.items.length === 0) {
      errors.push('items must have at least one item');
    } else {
      data.items.forEach((item: any, index: number) => {
        if (!item.menu_item_id) {
          errors.push(`items[${index}].menu_item_id is required`);
        }
        if (!item.quantity) {
          errors.push(`items[${index}].quantity is required`);
        }
        if (item.quantity && item.quantity <= 0) {
          errors.push(`items[${index}].quantity must be positive`);
        }
      });
    }
    
    return { valid: errors.length === 0, errors };
  },
};

const updateOrderItemsSchema = {
  body: (data: any) => {
    const errors: string[] = [];
    
    const err1 = validators.required(data.items, 'items');
    if (err1) errors.push(err1);
    
    if (!Array.isArray(data.items)) {
      errors.push('items must be an array');
    } else if (data.items.length === 0) {
      errors.push('items must have at least one item');
    } else {
      data.items.forEach((item: any, index: number) => {
        if (!item.menu_item_id) {
          errors.push(`items[${index}].menu_item_id is required`);
        }
        if (!item.quantity) {
          errors.push(`items[${index}].quantity is required`);
        }
        if (item.quantity && item.quantity <= 0) {
          errors.push(`items[${index}].quantity must be positive`);
        }
      });
    }
    
    return { valid: errors.length === 0, errors };
  },
};

// Routes
orderRoutes.get('/', orderController.getAll);
orderRoutes.get('/:id', orderController.getById);
orderRoutes.get('/table/:tableId', orderController.getByTableId);
orderRoutes.get('/table/:tableId/active', orderController.getActiveByTableId);
orderRoutes.post('/', validate(createOrderSchema), orderController.create);
orderRoutes.put('/:id/items', validate(updateOrderItemsSchema), orderController.updateItems);
orderRoutes.post('/:id/cancel', orderController.cancel);
