import {defineEventHandler, getQuery} from '#imports';
import {isAuthorizedHandler} from '../../../handlers';
import {PermissionId} from '../../../../../package/permissions';
import {type Role} from '../../../datasources/schemas/role';
import {type DatabaseHandler} from '../../../databaseHandler';
import {useAppContextValidator} from '#app-context-module';
import defineDatabaseHandler from '#authorization-module-database-handler';

export default defineEventHandler(async (event) => {
  await isAuthorizedHandler(event, PermissionId.CAN_READ_ROLE);

  const appContextValidator = useAppContextValidator(event);
  const {appId, tenantId} = appContextValidator.validate(getQuery(event));

  const client = await (defineDatabaseHandler as DatabaseHandler).getMainDatabaseClient();
  const AuthorizationRoleModel = client.getModel<Role>('authorization_roles');

  return await AuthorizationRoleModel.find({appId, tenantId});
});
