import type {H3Event} from 'h3';
import {defineEventHandler} from '#imports';
import {User} from '~/server/datasources/db/core/schemas/user';
import databaseHandler from '~/server/datasources/db/core/databaseHandler';

export default defineEventHandler(async (event: H3Event) => {
  const client = await databaseHandler.getMainDatabaseClient();

  return await client.getModel<User>('users').find({})
    .populate({
      path: 'authorization.appAccesses.roles',
      model: client.getModel('authorization_roles')
    })
    .sort('name');
});
