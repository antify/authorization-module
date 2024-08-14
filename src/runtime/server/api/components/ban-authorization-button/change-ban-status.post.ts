import {createError, defineEventHandler, readBody, useRuntimeConfig} from '#imports';
import {isLoggedInHandler} from '../../../handlers';
import {PermissionId} from '../../../../../package/permissions';
import {type DatabaseHandler} from '../../../databaseHandler';
import defineDatabaseHandler from '#authorization-module-database-handler';
import {isMongoDbObjectIdRule, isOneOfRule, useValidator} from '@antify/validate';
import type {ChangeBanStatusRequestBody} from '~/src/runtime/glue/components/ban-authorization-button/types';

export const validator = useValidator<ChangeBanStatusRequestBody>({
  authorizationId: {
    rules: isMongoDbObjectIdRule
  },
  action: {
    rules: (val) => isOneOfRule(val, ['ban', 'unban'])
  }
});

export default defineEventHandler(async (event) => {
  const {mainAppId} = useRuntimeConfig().public.authorizationModule;
  const body = validator.validate(await readBody(event));

  if (validator.hasErrors()) {
    throw new Error(validator.getErrorsAsString());
  }

  const guard = await isLoggedInHandler(event);

  if (!guard.hasPermissionTo(body.action === 'ban' ? PermissionId.CAN_BAN_AUTHORIZATION : PermissionId.CAN_UNBAN_AUTHORIZATION, mainAppId)) {
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
    .findOneAuthorization(body.authorizationId);

  if (!authorization) {
    return {
      notFound: true
    };
  }

  authorization.isBanned = body.action === 'ban';

  await databaseHandler.updateAuthorization(authorization);

  return {
    _id: authorization._id,
    isBanned: authorization.isBanned
  };
});
