import mongoose from 'mongoose';
import {type User} from '../schemas/user';
import {defineFixture} from '@antify/database';
import {TEST_TENANT_ID} from '../fixture-utils/tenant';
import {generateAuthorizations} from '../../../../../src/cli/fixture-utils/authorization';
import {
  ADMIN_ROLE_ID,
  EMPLOYEE_ROLE_ID,
} from './role';

export const TENANT_ADMIN_USER_ID = '66101beed102d338527bcbe5';
export const TENANT_USER_ID = '66101beed102d338527bcbe6';

export const generateUsers = (count: number = 100, data: Partial<User> = {}): User[] => {
  return Array.from({length: count}, (_, index) => ({
    _id: new mongoose.Types.ObjectId().toString(),
    name: `User ${index}`,
    authorization: generateAuthorizations(1)[0],
    ...data
  }));
};

export default defineFixture({
  async load(client) {
    await client.getModel('users').insertMany([
      generateUsers(1, {
        _id: TENANT_ADMIN_USER_ID,
        name: 'Admin user',
        authorization: generateAuthorizations(1, {
          tenantId: TEST_TENANT_ID,
          roles: [ADMIN_ROLE_ID],
        })[0]
      })[0],
      generateUsers(1, {
        _id: TENANT_USER_ID,
        name: 'Restricted user',
        authorization: generateAuthorizations(1, {
          tenantId: TEST_TENANT_ID,
          roles: [EMPLOYEE_ROLE_ID],
        })[0]
      })[0]
    ]);
  },

  dependsOn() {
    return ['role'];
  }
});
