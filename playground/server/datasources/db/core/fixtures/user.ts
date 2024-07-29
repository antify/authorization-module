import mongoose from 'mongoose';
import {type User} from '../schemas/user';
import {defineFixture} from '@antify/database';
import {TEST_TENANT_ID} from '../fixture-utils/tenant';
import {generateAuthorizations} from '../../../../../../src/cli/fixture-utils/authorization';
import {generateAppAccesses} from '../../../../../../src/cli/fixture-utils/appAccess';
import {
  TENANT_ADMIN_ROLE_ID,
  TENANT_USER_ROLE_ID,
  CORE_ADMIN_ROLE_ID,
  CORE_USER_ROLE_ID
} from './role';

export const SUPER_ADMIN_USER_ID = '66101beed102d338527bcbe4';
export const CORE_ADMIN_USER_ID = '661f73b3e90e013526837a00';
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

// TODO:: Add a user which has access to core and tenant
// TODO:: create banned and pending user tenant access
export default defineFixture({
  async load(client) {
    await client.getModel('users').insertMany([
      generateUsers(1, {
        _id: SUPER_ADMIN_USER_ID,
        name: 'Super admin user',
        authorization: generateAuthorizations(1, {isSuperAdmin: true})[0]
      })[0],
      generateUsers(1, {
        _id: CORE_ADMIN_USER_ID,
        name: 'Core admin user',
        authorization: generateAuthorizations(1, {
          appAccesses: generateAppAccesses(1, {
            appId: 'core',
            roles: [CORE_ADMIN_ROLE_ID],
          })
        })[0]
      })[0],
      generateUsers(1, {
        _id: TENANT_ADMIN_USER_ID,
        name: 'Tenant admin user',
        authorization: generateAuthorizations(1, {
          appAccesses: generateAppAccesses(1, {
            appId: 'tenant',
            tenantId: TEST_TENANT_ID,
            roles: [TENANT_ADMIN_ROLE_ID],
          })
        })[0]
      })[0],
      generateUsers(1, {
        _id: TENANT_USER_ID,
        name: 'Tenant user',
        authorization: generateAuthorizations(1, {
          appAccesses: generateAppAccesses(1, {
            appId: 'tenant',
            tenantId: TEST_TENANT_ID,
            roles: [TENANT_USER_ROLE_ID],
          })
        })[0]
      })[0],
      generateUsers(1, {
        name: 'Tenant and core user',
        authorization: generateAuthorizations(1, {
          appAccesses: [
            generateAppAccesses(1, {
              appId: 'tenant',
              tenantId: TEST_TENANT_ID,
              roles: [TENANT_USER_ROLE_ID],
            })[0],
            generateAppAccesses(1, {
              appId: 'core',
              roles: [CORE_USER_ROLE_ID],
            })[0],
          ],
        })[0]
      })[0],
    ]);
  },

  dependsOn() {
    return ['role'];
  }
});
