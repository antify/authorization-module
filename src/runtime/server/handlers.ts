import * as jose from 'jose';
import {useAuth} from './auth';
import {Guard} from '../guard';
import {type H3Event} from 'h3';
import {createError} from '#imports';
import {isValidAppContextHandler} from '#app-context-module';

export const isLoggedInHandler = async (event: H3Event): Promise<Guard> => {
  let guard: Guard;

  try {
    guard = await useAuth().verify(event);
  } catch (e) {
    if (!(e instanceof jose.errors.JOSEError)) {
      throw e;
    }

    // TODO:: log into security log
    console.log(e.code);

    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    });
  }

  return guard;
};

export const isAuthorizedHandler = async (
  event: H3Event,
  permissions: string | string[]
): Promise<Guard> => {
  const guard = await isLoggedInHandler(event);
  const {appId, tenantId} = isValidAppContextHandler(event);

  if (!guard.hasPermissionTo(permissions, appId, tenantId)) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden'
    });
  }

  return guard;
};
