import type {
  Authorization,
} from '../../../../../src/runtime/server/types';
import {
  Types,
} from 'mongoose';

export const generateAuthorizations = (count: number = 100, data: Partial<Authorization> = {}): Authorization[] => {
  return Array.from<{
    length: number;
  }, Authorization>({
    length: count,
  }, () => ({
    _id: new Types.ObjectId().toString(),
    tenantId: null,
    isBanned: false,
    isAdmin: false,
    roles: [],
    allPermissions: [],
    ...data,
  }));
};
