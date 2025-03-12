import {Role, ROLE_SCHEMA_NAME} from '../../../../datasources/schemas/role';
import defineDatabaseHandler from '#authorization-module-database-handler';
import type {DatabaseHandler} from '~/src/runtime/server';
import {isAuthorizedHandler} from '../../../../handlers';
import {PermissionId} from '../../../../../permissions';
import {defineEventHandler, getQuery} from '#imports';
import {useEventReader} from '../../../../utils';
import {object, number, string} from 'yup';
import {type FilterQuery} from 'mongoose';

export default defineEventHandler(async (event) => {
  await isAuthorizedHandler(event, PermissionId.CAN_READ_ROLE);

  const {p, ipp} = await object({
    p: number().default(1),
    ipp: number().default(20),
    search: string().nullable().default(null),
  }).validate(getQuery(event), {stripUnknown: true});
  const query = getQuery(event);
  const filter: FilterQuery<Role> = {};

  if (query.search) {
    filter['$or'] = [
      {name: {$regex: query.search, $options: 'i'}},
    ];
  }

  const client = await (defineDatabaseHandler as DatabaseHandler)
    .getDatabaseClient(useEventReader().getTenantId(event));
  const RoleModel = client.getModel<Role>(ROLE_SCHEMA_NAME);
  const roles = await RoleModel.find(filter)
    .skip((p - 1) * ipp)
    .limit(ipp)
    .collation({locale: 'en'})
    .sort({
      'name': 'asc'
    });

  return {
    count: await RoleModel.countDocuments(filter),
    roles
  };
});
