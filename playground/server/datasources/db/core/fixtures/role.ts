import {defineFixture} from '@antify/database';
import {PermissionId} from '../../../../../../src/runtime/glue/permissions';
import {type Role} from '#authorization-module';
import {TEST_TENANT_ID} from '../fixture-utils/tenant';
import {generateRoles} from '../../../../../../src/cli/fixture-utils/role';

export const TENANT_ADMIN_ROLE_ID = '63f73526b5db16c4a92d6c33';
export const TENANT_USER_ROLE_ID = '63f73526b5db16c4a92d6c34';
export const CORE_ADMIN_ROLE_ID = '661f73b3e90e013526837a02';
export const CORE_USER_ROLE_ID = '6620e571baa95e0b8929f66d';

export default defineFixture({
	async load(client) {
		await client.getModel<Role>('authorization_roles').insertMany([
			generateRoles(1, {
				_id: TENANT_ADMIN_ROLE_ID,
				name: 'Admin',
				isAdmin: true,
				appId: 'tenant',
				tenantId: TEST_TENANT_ID
			})[0],
			generateRoles(1, {
				_id: TENANT_USER_ROLE_ID,
				name: 'Employee',
				isAdmin: false,
				permissions: Object.values(PermissionId),
				appId: 'tenant',
				tenantId: TEST_TENANT_ID
			})[0],
			generateRoles(1, {
				_id: CORE_ADMIN_ROLE_ID,
				name: 'Admin',
				isAdmin: true,
				appId: 'core'
			})[0],
			generateRoles(1, {
				_id: CORE_USER_ROLE_ID,
				name: 'Employee',
				isAdmin: false,
				permissions: Object.values(PermissionId),
				appId: 'core'
			})[0],
			...generateRoles(96, {
				appId: 'tenant',
				tenantId: TEST_TENANT_ID
			})
		])
	},

	dependsOn() {
		return []
	}
});
