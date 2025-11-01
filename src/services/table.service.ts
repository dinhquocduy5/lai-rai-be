import { tableRepo } from '@/repositories/table.repo';
import type { CreateTableDTO, UpdateTableDTO } from '@/models/tables';
import { ConflictError } from '@/utils/errors';

export const tableService = {
  async getAllTables() {
    return tableRepo.findAll();
  },

  async getTableById(id: number) {
    return tableRepo.findByIdOrThrow(id);
  },

  async createTable(data: CreateTableDTO) {
    return tableRepo.create(data);
  },

  async updateTable(id: number, data: UpdateTableDTO) {
    return tableRepo.update(id, data);
  },

  async deleteTable(id: number) {
    // Check if table is occupied
    const table = await tableRepo.findByIdOrThrow(id);
    if (table.status === 'occupied') {
      throw new ConflictError('Cannot delete occupied table');
    }
    return tableRepo.delete(id);
  },

  async setTableAvailable(id: number) {
    return tableRepo.updateStatus(id, 'available');
  },

  async setTableOccupied(id: number) {
    return tableRepo.updateStatus(id, 'occupied');
  },
};
