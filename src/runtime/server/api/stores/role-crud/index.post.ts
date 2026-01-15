import defineDatabaseHandler from '#authorization-module-database-handler';
import {
  isLoggedInHandler,
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
  useEventReader,
} from '../../../utils';

export default defineEventHandler(async (event) => {
  await isLoggedInHandler(event);

  const body = await roleServerSchema
    .validate(await readBody(event), {
      strict: true,
      stripUnknown: true,
    });

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
