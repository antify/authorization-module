import {createError, defineEventHandler, readBody} from '#imports';
import {isLoggedInHandler} from '../../../handlers';
import {PermissionId} from '../../../../glue/permissions';
import {type DatabaseHandler} from '../../../databaseHandler';
import defineDatabaseHandler from '#authorization-module-database-handler';
import {isMongoDbObjectIdRule, isOneOfRule, useValidator} from '@antify/validate';
import type {
  ChangeBanStatusRequestBody,
  AppAccess
} from '~/src/runtime/glue/components/ban-app-access-button/types';
import {type AppAccess as AppAccessDoc} from '../../../datasources/appAccess';

export const validator = useValidator<ChangeBanStatusRequestBody>({
  authorizationId: {
    rules: isMongoDbObjectIdRule
  },
  appAccessId: {
    rules: isMongoDbObjectIdRule
  },
  action: {
    rules: (val) => isOneOfRule(val, ['ban', 'unban'])
  }
});

export default defineEventHandler<AppAccess>(async (event) => {
  const guard = await isLoggedInHandler(event);
  const body = validator.validate(await readBody(event));

  if (validator.hasErrors()) {
    throw new Error(validator.getErrorsAsString());
  }

  if (body.authorizationId === guard.getId()) {
    throw new Error(`You can not ${body.action} yourself`);
  }

  const databaseHandler = (defineDatabaseHandler as DatabaseHandler);
  const authorization = await databaseHandler
    .findOneAuthorization(body.authorizationId);
  const appAccessIndex = authorization?.appAccesses
    .findIndex((appAccess) => appAccess._id.toString() === body.appAccessId);

  if (!authorization || appAccessIndex === -1 || appAccessIndex === undefined) {
    return {
      notFound: true
    };
  }

  const appAccess = authorization.appAccesses[appAccessIndex];

  /**
   * Keep in mind, the AppId and tenantId given
   * in request headers emits, where the data is stored in the database.
   *
   * But to make sure, the user has the permission to ban / unban the app access,
   * the AppAccess.appId and AppAccess.tenantId must be compared with
   * the token.
   */
  if (
    !guard.hasPermissionTo(
      body.action === 'ban' ?
        PermissionId.CAN_BAN_APP_ACCESS :
        PermissionId.CAN_UNBAN_APP_ACCESS,
      appAccess.appId,
      appAccess.tenantId) ||
    // Make sure, the user has permissions to ban an admin user
    (
      isAdmin(appAccess) &&
      !guard.hasPermissionTo(
        body.action === 'ban' ?
          PermissionId.CAN_BAN_ADMIN_APP_ACCESS :
          PermissionId.CAN_UNBAN_ADMIN_APP_ACCESS,
        appAccess.appId,
        appAccess.tenantId)
    )
  ) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden'
    });
  }

  authorization.appAccesses[appAccessIndex].isBanned = body.action === 'ban';

  await databaseHandler.updateAuthorization(authorization);

  return {
    _id: appAccess._id,
    isBanned: appAccess.isBanned
  };
});

function isAdmin(appAccess: AppAccessDoc) {
  return appAccess.roles.some(role => role.isAdmin);
}
