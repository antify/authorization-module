import {
  generateRoles,
} from '../fixture-utils/role';
import {
  PermissionId,
} from '#shared/permissions';
import {
  defineFixture,
} from '@antify/database';
import {
  defineRoleSchema,
} from '../schemas/role';

export const ADMIN_ROLE_ID = '63f73526b5db16c4a92d6c33';
export const EMPLOYEE_ROLE_ID = '63f73526b5db16c4a92d6c34';

export default defineFixture({
  async load(client) {
    await client.getModel(defineRoleSchema).insertMany([
      generateRoles(1, {
        _id: ADMIN_ROLE_ID,
        name: 'Admin',
        isAdmin: true,
      })[0],
      generateRoles(1, {
        _id: EMPLOYEE_ROLE_ID,
        name: 'Employee',
        isAdmin: false,
        permissions: Object.values(PermissionId),
      })[0],
      ...generateRoles(96, {}),
    ]);
  },

  dependsOn() {
    return [];
  },
});
