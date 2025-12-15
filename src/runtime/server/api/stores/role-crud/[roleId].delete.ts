import defineDatabaseHandler from '#authorization-module-database-handler';
import type {
  DatabaseHandler,
} from '~/src/runtime/server';
import {
  isAuthorizedHandler,
} from '../../../handlers';
import {
  PermissionId,
} from '../../../../permissions';
import {
  useEventReader,
} from '../../../utils';
import {
  defineEventHandler,
} from '#imports';

export default defineEventHandler(async (event) => {
  // await isAuthorizedHandler(event, PermissionId.CAN_DELETE_ROLE);

  await (defineDatabaseHandler as DatabaseHandler)
    .deleteRoleById(event.context.params!.roleId, useEventReader().getTenantId(event));

  return {
    success: true,
  };
});
