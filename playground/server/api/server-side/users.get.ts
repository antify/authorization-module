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

export default defineEventHandler(async (event) => {
  const client = await useDatabaseClient('app', useEventReader().getTenantId(event));

  return client
    .getModel(defineUserSchema)
    .find({})
    .sort('name');
});
