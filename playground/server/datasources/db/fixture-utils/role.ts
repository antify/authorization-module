import type {
  Role,
} from '../../../../../src/runtime/server/types';
import {
  Types,
} from 'mongoose';

export const generateRoles = (
  count: number = 100,
  data: Partial<Role>,
): Role[] => {
  return Array.from<{
    length: number;
  }, Role>({
    length: count,
  }, (_, index) => ({
    _id: new Types.ObjectId().toString(),
    name: `Role ${index}`,
    isAdmin: false,
    permissions: [],
    ...data,
  }));
};
