import {type Authorization} from '../../runtime/server/datasources/authorization';
import mongoose from 'mongoose';

export const generateAuthorizations = (count: number = 100, data: Partial<Authorization> = {}): Authorization[] => {
  return Array.from({length: count}, () => ({
    _id: new mongoose.Types.ObjectId().toString(),
    isSuperAdmin: false,
    isBanned: false,
    appAccesses: [],
    ...data
  }));
};
