import {defineEventHandler, getQuery} from '#imports';
import {isAuthorizedHandler} from '../../../handlers';
import {PermissionId} from '../../../../permissions';
import {type DatabaseHandler} from '../../../databaseHandler';
import {useAppContextValidator} from '#app-context-module';
import defineDatabaseHandler from '#authorization-module-database-handler';
import {ROLE_SCHEMA_NAME} from '../../../datasources/schemas/role';

export default defineEventHandler(async (event) => {
  await isAuthorizedHandler(event, PermissionId.CAN_READ_ROLE);

  const appContextValidator = useAppContextValidator(event);
  const {appId, tenantId} = appContextValidator.validate(getQuery(event));

  const client = await (defineDatabaseHandler as DatabaseHandler).getMainDatabaseClient();
  const filter = {appId};

  if (tenantId) {
    filter.tenantId = tenantId;
  }

  return await client.getModel(ROLE_SCHEMA_NAME).find(filter);
});
