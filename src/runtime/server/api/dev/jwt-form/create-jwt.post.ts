import {
  setCookie, defineEventHandler, useRuntimeConfig, readBody,
} from '#imports';
import {
  object, number, array, boolean, string,
} from 'yup';
import {
  type JsonWebToken,
} from '../../../../types';
import {
  useAuth,
} from '../../../auth';

const requestBodySchema = object({
  id: string().default(''),
  tenantId: string().nullable().default(null),
  isBanned: boolean().required(),
  isAdmin: boolean().required(),
  permissions: array().of(string()).required(),
  exp: number().optional(),
  iat: number().optional(),
});

export default defineEventHandler(async (event) => {
  // TODO:: only call in dev mode!
  const {
    tokenCookieName, jwtSecret, jwtExpiration,
  } = useRuntimeConfig().authorizationModule;
  const data = await readBody<JsonWebToken>(event);
  const expirationDate = new Date();

  const validatedData = await requestBodySchema.validate(data);

  expirationDate.setMinutes(expirationDate.getMinutes() + jwtExpiration);

  setCookie(
    event,
    tokenCookieName,
    await useAuth().signToken(validatedData, jwtSecret, validatedData.exp || expirationDate, validatedData.iat),
  );

  return {};
});
