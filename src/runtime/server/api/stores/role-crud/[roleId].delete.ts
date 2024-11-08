import {defineEventHandler} from '#imports';
import defineDatabaseHandler from '#authorization-module-database-handler';
import {isAuthorizedHandler} from '../../../handlers';
import {PermissionId} from '../../../../permissions';
import {ROLE_SCHEMA_NAME, Role} from '../../../datasources/schemas/role';
import type {DatabaseHandler} from '~/src/runtime/server';

export default defineEventHandler(async (event) => {
  await isAuthorizedHandler(event, PermissionId.CAN_DELETE_ROLE);

  const client = await (defineDatabaseHandler as DatabaseHandler).getMainDatabaseClient();
  const RoleModel = client.getModel<Role>(ROLE_SCHEMA_NAME);

  return await RoleModel.findOneAndDelete({_id: event.context.params!.roleId}) === null ?
    {notFound: true} :
    {success: true};
});
