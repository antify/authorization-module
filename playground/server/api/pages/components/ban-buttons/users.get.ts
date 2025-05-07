import {
  defineEventHandler,
} from '#imports';
import {
  defineUserSchema,
} from '~/server/datasources/db/schemas/user';
import {
  useDatabaseClient,
} from '#database-module';
import {
  useEventReader,
} from '#authorization-module';
import {
  defineRoleSchema,
} from '~/server/datasources/db/schemas/role';

export default defineEventHandler(async (event) => {
  const client = await useDatabaseClient('app', useEventReader().getTenantId(event));

  return client.getModel(defineUserSchema).find({})
    .populate({
      path: 'authorization.roles',
      model: client.getModel(defineRoleSchema),
    })
    .sort('name');
});
