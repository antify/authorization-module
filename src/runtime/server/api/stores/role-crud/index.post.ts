import defineDatabaseHandler from '#authorization-module-database-handler';
import {
  isLoggedInHandler,
  isAuthorizedHandler,
} from '../../../handlers';
import {
  roleServerSchema,
} from '../../../../glue/stores/role-crud';
import type {
  DatabaseHandler,
} from '../../../databaseHandler';
import {
  readBody,
  defineEventHandler,
} from '#imports';
import {
  PermissionId,
} from '../../../../permissions';
import {
  useEventReader,
} from '../../../utils';

export default defineEventHandler(async (event) => {
  await isLoggedInHandler(event);

  const body = await roleServerSchema
    .validate(await readBody(event), {
      strict: true,
      stripUnknown: true,
    });

  await isAuthorizedHandler(event, body._id === null ? PermissionId.CAN_CREATE_ROLE : PermissionId.CAN_UPDATE_ROLE);

  const databaseHandler = await (defineDatabaseHandler as DatabaseHandler);
  const eventReader = useEventReader();
  const role = await databaseHandler.saveRole(body, eventReader.getTenantId(event));

  if (!role) {
    return {
      notFound: true,
    };
  }

  return roleServerSchema.cast(role, {
    stripUnknown: true,
  });
});
