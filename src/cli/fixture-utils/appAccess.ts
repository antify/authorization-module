import {type AppAccess} from '../../runtime/server/datasources/appAccess';
import {Types} from 'mongoose';

export const generateAppAccesses = (
  count: number = 100,
  data: Partial<AppAccess> & Required<Pick<AppAccess, 'appId'>>
): AppAccess[] => {
  return Array.from<{ length: number }, AppAccess>({length: count}, () => ({
    _id: new Types.ObjectId(),
    tenantId: null,
    isBanned: false,
    roles: [],
    ...data
  }));
};
