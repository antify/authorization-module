import defineDatabaseHandler from '#authorization-module-database-handler';
import {
  type DatabaseHandler,
} from '../../../databaseHandler';
import {
  useEventReader,
} from '../../../utils';
import {
  defineEventHandler,
} from '#imports';

export default defineEventHandler(async (event) => {
  const eventReader = useEventReader();

  return (await (defineDatabaseHandler as DatabaseHandler)
    .findRoles({}, {}, {}, eventReader.getTenantId(event)))
    .map((role) => ({
      label: role.name,
      value: role._id,
    }));
});
