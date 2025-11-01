import { Router } from 'express';
import { paymentController } from '@/controllers/payment.controller';
import { validate, validators } from '@/middlewares/validate';

export const paymentRoutes = Router();

// Validation schemas
const createPaymentSchema = {
  body: (data: any) => {
    const errors: string[] = [];
    
    const err1 = validators.required(data.order_id, 'order_id');
    if (err1) errors.push(err1);
    
    const err2 = validators.isNumber(data.order_id, 'order_id');
    if (err2) errors.push(err2);
    
    if (data.order_id !== undefined) {
      const err3 = validators.isPositive(data.order_id, 'order_id');
      if (err3) errors.push(err3);
    }
    
    const err4 = validators.required(data.amount, 'amount');
    if (err4) errors.push(err4);
    
    const err5 = validators.isNumber(data.amount, 'amount');
    if (err5) errors.push(err5);
    
    if (data.amount !== undefined) {
      const err6 = validators.isPositive(data.amount, 'amount');
      if (err6) errors.push(err6);
    }
    
    if (data.payment_method !== undefined) {
      const err7 = validators.isEnum(data.payment_method, ['cash'], 'payment_method');
      if (err7) errors.push(err7);
    }
    
    return { valid: errors.length === 0, errors };
  },
};

// Routes
paymentRoutes.get('/', paymentController.getAll);
paymentRoutes.get('/revenue', paymentController.getRevenue);
paymentRoutes.get('/:id', paymentController.getById);
paymentRoutes.get('/order/:orderId', paymentController.getByOrderId);
paymentRoutes.post('/', validate(createPaymentSchema), paymentController.create);
