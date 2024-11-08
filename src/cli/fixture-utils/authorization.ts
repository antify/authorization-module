import {type Authorization} from '../../runtime/server/datasources/authorization';
import {Types} from 'mongoose';

export const generateAuthorizations = (count: number = 100, data: Partial<Authorization> = {}): Authorization[] => {
  return Array.from<{ length: number }, Authorization>({length: count}, () => ({
    _id: new Types.ObjectId(),
    isSuperAdmin: false,
    isBanned: false,
    appAccesses: [],
    ...data
  }));
};
