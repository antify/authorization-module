import {defineEventHandler} from '#imports';
import {User} from '~/server/datasources/db/schemas/user';
import {useDatabaseClient} from "#database-module";
import {useEventReader} from "#authorization-module";

export default defineEventHandler(async (event) => {
  const client = await useDatabaseClient('app', useEventReader().getTenantId(event));

  return await client.getModel<User>('users').find({})
    .populate({
      path: 'authorization.roles',
      model: client.getModel('authorization_roles')
    })
    .sort('name');
});
