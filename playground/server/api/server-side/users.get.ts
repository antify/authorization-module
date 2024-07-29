import {defineEventHandler} from '#imports';
import {User} from '~/server/datasources/db/core/schemas/user';
import databaseHandler from '../../datasources/db/core/databaseHandler';

export default defineEventHandler(async () => {
  const userModel = (await databaseHandler.getMainDatabaseClient())
    .getModel<User>('users');

  return await userModel.find({}).sort('name');
});
