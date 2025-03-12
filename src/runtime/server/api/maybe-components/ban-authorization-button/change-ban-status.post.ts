import defineDatabaseHandler from '#authorization-module-database-handler';
import {createError, defineEventHandler, readBody} from '#imports';
import {type DatabaseHandler} from '../../../databaseHandler';
import {PermissionId} from '../../../../permissions';
import {isLoggedInHandler} from '../../../handlers';
import {useEventReader} from '../../../utils';
import {object, string} from 'yup';

const requestSchema = object({
  authorizationId: string().required(),
  action: string().oneOf(['ban', 'unban']).required(),
  tenantId: string().nullable(),
});

export default defineEventHandler(async (event) => {
  const body = await requestSchema.validate(await readBody(event));
  const guard = await isLoggedInHandler(event);
  const eventReader = useEventReader();

  if (!guard.hasPermissionTo(body.action === 'ban' ? PermissionId.CAN_BAN_AUTHORIZATION : PermissionId.CAN_UNBAN_AUTHORIZATION)) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden'
    });
  }

  if (body.authorizationId === guard.getId()) {
    throw new Error(`You can not ${body.action} yourself`);
  }

  const databaseHandler = (defineDatabaseHandler as DatabaseHandler);
  const authorization = await databaseHandler
    .findOneAuthorization(body.authorizationId, eventReader.getTenantId(event));

  if (!authorization) {
    return {
      notFound: true
    };
  }

  authorization.isBanned = body.action === 'ban';

  await databaseHandler.updateAuthorization(authorization, eventReader.getTenantId(event));

  return {
    _id: authorization._id,
    isBanned: authorization.isBanned
  };
});
