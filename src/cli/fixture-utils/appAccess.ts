import {type AppAccess} from '../../runtime/server/datasources/appAccess';
import mongoose from 'mongoose';

export const generateAppAccesses = (
  count: number = 100,
  data: Partial<AppAccess> & Required<Pick<AppAccess, 'appId'>>
): AppAccess[] => {
  return Array.from({length: count}, () => ({
    _id: new mongoose.Types.ObjectId().toString(),
    tenantId: null,
    isBanned: false,
    roles: [],
    ...data
  }));
};
