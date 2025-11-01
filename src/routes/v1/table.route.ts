import { Router } from 'express';
import { tableController } from '@/controllers/table.controller';
import { validate, validators } from '@/middlewares/validate';

export const tableRoutes = Router();

// Validation schemas
const createTableSchema = {
  body: (data: any) => {
    const errors: string[] = [];
    const err1 = validators.required(data.name, 'name');
    if (err1) errors.push(err1);
    const err2 = validators.isString(data.name, 'name');
    if (err2) errors.push(err2);
    if (data.name && data.name.length > 50) {
      errors.push(validators.maxLength(data.name, 50, 'name') || '');
    }
    if (data.status) {
      const err3 = validators.isEnum(data.status, ['available', 'occupied'], 'status');
      if (err3) errors.push(err3);
    }
    return { valid: errors.length === 0, errors };
  },
};

const updateTableSchema = {
  body: (data: any) => {
    const errors: string[] = [];
    if (data.name !== undefined) {
      const err1 = validators.isString(data.name, 'name');
      if (err1) errors.push(err1);
      if (data.name.length > 50) {
        errors.push(validators.maxLength(data.name, 50, 'name') || '');
      }
    }
    if (data.status !== undefined) {
      const err2 = validators.isEnum(data.status, ['available', 'occupied'], 'status');
      if (err2) errors.push(err2);
    }
    return { valid: errors.length === 0, errors };
  },
};

// Routes
tableRoutes.get('/', tableController.getAll);
tableRoutes.get('/:id', tableController.getById);
tableRoutes.post('/', validate(createTableSchema), tableController.create);
tableRoutes.put('/:id', validate(updateTableSchema), tableController.update);
tableRoutes.delete('/:id', tableController.delete);
tableRoutes.patch('/:id/available', tableController.setAvailable);
tableRoutes.patch('/:id/occupied', tableController.setOccupied);
