import defineDatabaseHandler from '#authorization-module-database-handler';
import {ROLE_SCHEMA_NAME, Role} from '../../../datasources/schemas/role';
import type {DatabaseHandler} from '~/src/runtime/server';
import {isAuthorizedHandler} from '../../../handlers';
import {PermissionId} from '../../../../permissions';
import {useEventReader} from '../../../utils';
import {defineEventHandler} from '#imports';

export default defineEventHandler(async (event) => {
  await isAuthorizedHandler(event, PermissionId.CAN_DELETE_ROLE);

  const client = await (defineDatabaseHandler as DatabaseHandler)
    .getDatabaseClient(useEventReader().getTenantId(event));
  const RoleModel = client.getModel<Role>(ROLE_SCHEMA_NAME);

  return await RoleModel.findOneAndDelete({_id: event.context.params!.roleId}) === null ?
    {notFound: true} :
    {success: true};
});
