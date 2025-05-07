import defineDatabaseHandler from '#authorization-module-database-handler';
import {
  roleServerSchema,
} from '../../../../glue/stores/role-crud';
import {
  defineEventHandler,
  useRuntimeConfig,
} from '#imports';
import type {
  DatabaseHandler,
} from '../../../databaseHandler';
import {
  isAuthorizedHandler,
} from '../../../handlers';
import {
  PermissionId,
} from '../../../../permissions';
import {
  useEventReader,
} from '../../../utils';

export default defineEventHandler(async (event) => {
  await isAuthorizedHandler(event, PermissionId.CAN_READ_ROLE);

  const eventReader = useEventReader();
  const role = await (defineDatabaseHandler as DatabaseHandler).findRoleById(
    event.context.params!.roleId,
    eventReader.getTenantId(event),
  );
  const {
    permissions,
  } = useRuntimeConfig().authorizationModule;

  if (!role) {
    return {
      notFound: true,
    };
  }

  return {
    role: roleServerSchema.cast(role, {
      stripUnknown: true,
    }),
    allPermissions: permissions,
  };
});
