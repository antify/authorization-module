import {type Role} from '../../runtime/server/datasources/schemas/role';
import {Types} from 'mongoose';

export const generateRoles = (
  count: number = 100,
  data: Partial<Role>
): Role[] => {
  return Array.from<{ length: number }, Role>({length: count}, (_, index) => ({
    _id: new Types.ObjectId(),
    name: `Role ${index}`,
    isAdmin: false,
    permissions: [],
    tenantId: null,
    ...data
  }));
};
