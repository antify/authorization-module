import {type JsonWebToken} from '../../../../types';
import {useAuth} from '../../../auth';
import {
  setCookie,
  defineEventHandler,
  useRuntimeConfig,
  readBody
} from '#imports';

export default defineEventHandler(async (event) => {
  // TODO:: only call in dev mode!
  const {tokenCookieName, jwtSecret, jwtExpiration} = useRuntimeConfig().authorizationModule;
  const data = await readBody<JsonWebToken>(event);
  const expirationDate = new Date();

  expirationDate.setMinutes(expirationDate.getMinutes() + jwtExpiration);

  setCookie(
    event,
    tokenCookieName,
    await useAuth().signToken(data, jwtSecret, data.exp || expirationDate, data.iat)
  );

  return {};
});
