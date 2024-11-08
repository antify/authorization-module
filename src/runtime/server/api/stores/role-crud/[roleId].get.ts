import defineDatabaseHandler from '#authorization-module-database-handler';
import {ROLE_SCHEMA_NAME} from '../../../datasources/schemas/role';
import {roleServerSchema} from '../../../../glue/stores/role-crud';
import {defineEventHandler, useRuntimeConfig} from '#imports';
import {type DatabaseHandler} from '../../../databaseHandler';
import {isValidAppContextHandler} from '#app-context-module';
import {isAuthorizedHandler} from '../../../handlers';
import {PermissionId} from '../../../../permissions';

export default defineEventHandler(async (event) => {
  await isAuthorizedHandler(event, PermissionId.CAN_READ_ROLE);

  const client = await (defineDatabaseHandler as DatabaseHandler).getMainDatabaseClient();
  const role = await client.getModel(ROLE_SCHEMA_NAME).findOne({_id: event.context.params!.roleId});
  const {permissions} = useRuntimeConfig().authorizationModule;
  const {appId} = isValidAppContextHandler(event);

  if (!role) {
    return {
      notFound: true
    };
  }

  return {
    role: roleServerSchema.cast(role, {stripUnknown: true}),
    allPermissions: permissions.filter(permission => permission.appIds === undefined || permission.appIds.includes(appId))
  };
});
