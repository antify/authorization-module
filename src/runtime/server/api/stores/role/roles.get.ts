import {isAuthorizedHandler} from '../../../handlers';
import {PermissionId} from '../../../../glue/permissions';
import {type Role} from '../../../datasources/schemas/role';
import {defineEventHandler} from '#imports';
import {getContext, useDatabaseClient} from '#database-module';

export default defineEventHandler(async (event) => {
	await isAuthorizedHandler(event, PermissionId.CAN_READ_ROLE)

	const {provider, tenantId} = getContext(event);
	const client = await useDatabaseClient(event);
	const AuthorizationRoleModel = client.getModel<Role>('authorization_roles');

	return await AuthorizationRoleModel.find({providerId: provider, tenantId});
});
