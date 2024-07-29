import type {H3Event} from 'h3';
import {defineEventHandler, readBody} from '#imports';
import {useAuth, type Role} from '#authorization-module';
import {type User} from '~/server/datasources/db/core/schemas/user';
import databaseHandler from '../../datasources/db/core/databaseHandler';

export default defineEventHandler(async (event: H3Event) => {
  const userId = (await readBody(event)).userId;

  if (!userId) {
    throw new Error('Missing userId');
  }

  const client = await databaseHandler.getMainDatabaseClient();
  const user = await client.getModel<User>('users')
    .findOne({_id: userId})
    .populate({
      path: 'authorization.appAccesses.roles',
      model: client.getModel<Role>('authorization_roles')
    });

  if (!user) {
    throw new Error('User not found');
  }

  await useAuth().login(event, user.authorization);

  return {success: true};
});
