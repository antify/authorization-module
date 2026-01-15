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
  useEventReader,
} from '../../../utils';

export default defineEventHandler(async (event) => {
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
