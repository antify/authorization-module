import defineDatabaseHandler from '#authorization-module-database-handler';
import {ROLE_SCHEMA_NAME} from '../../../datasources/schemas/role';
import {type DatabaseHandler} from '../../../databaseHandler';
import {isAuthorizedHandler} from '../../../handlers';
import {PermissionId} from '../../../../permissions';
import {useEventReader} from '../../../utils';
import {defineEventHandler} from '#imports';

export default defineEventHandler(async (event) => {
  await isAuthorizedHandler(event, PermissionId.CAN_READ_ROLE);

  const client = await (defineDatabaseHandler as DatabaseHandler)
    .getDatabaseClient(useEventReader().getTenantId(event));

  return (await client
    .getModel(ROLE_SCHEMA_NAME)
    .find() || [])
    .map((role) => ({
      label: role.name,
      value: role._id,
    }));
});
