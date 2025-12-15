import defineDatabaseHandler from '#authorization-module-database-handler';
import {
  isAuthorizedHandler,
} from '../../../../handlers';
import {
  PermissionId,
} from '../../../../../permissions';
import {
  defineEventHandler,
  getQuery,
} from '#imports';
import {
  object,
  number,
  string,
} from 'yup';
import type {
  DatabaseHandler,
} from './../../../../databaseHandler';
import {
  useEventReader,
} from '../../../../utils';

export default defineEventHandler(async (event) => {
  // await isAuthorizedHandler(event, PermissionId.CAN_READ_ROLE);

  const {
    p, ipp,
  } = await object({
    p: number().default(1),
    ipp: number().default(20),
    search: string().nullable().default(null),
  }).validate(getQuery(event), {
    stripUnknown: true,
  });
  const query = getQuery(event);
  const eventReader = useEventReader();

  const [
    roles,
    count,
  ] = await Promise.all([
    (defineDatabaseHandler as DatabaseHandler)
      .findRoles(
        {
          sort: 'name',
          sortDirection: 'asc',
        },
        {
          name: query.search,
        },
        {
          page: p,
          itemsPerPage: ipp,
        },
        eventReader.getTenantId(event),
      ),
    (defineDatabaseHandler as DatabaseHandler)
      .countRoles({
        name: query.search,
      }, eventReader.getTenantId(event)),
  ]);

  return {
    count,
    roles: roles.map((role) => ({
      _id: role._id,
      name: role.name,
    })),
  };
});
