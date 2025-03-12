import {type Authorization, type JsonWebToken} from '../types';
import {type H3Event, setCookie, deleteCookie} from 'h3';
import {type Role} from './datasources/role';
import {useRuntimeConfig} from '#imports';
import {decodeJwt, SignJWT} from 'jose';
import {useEventReader} from './utils';
import {Guard} from '../guard';
import * as jose from 'jose';

// TODO:: support different algorithm's
export const JWT_ALGORITHM = 'HS256';

const authorizationToJwt = (authorization: Authorization): JsonWebToken => {
  function emitValuesFromRoles(roles: Role[]): { isAdmin: boolean, permissions: string[] } {
    return {
      isAdmin: roles.some(role => role.isAdmin),
      permissions: roles.flatMap(role => role.permissions)
    };
  }

  return {
    id: authorization._id,
    tenantId: authorization.tenantId,
    isBanned: authorization.isBanned,
    isAdmin: emitValuesFromRoles(authorization.roles).isAdmin,
    permissions: emitValuesFromRoles(authorization.roles).permissions
  };
};

export const useAuth = () => {
  const {
    jwtExpiration,
    jwtSecret,
    tokenCookieName
  } = useRuntimeConfig().authorizationModule;
  const eventReader = useEventReader();

  return {
    async login(event: H3Event, authorization: Authorization) {
      // TODO:: Test and fix if needed
      // if (authorization?.roles[0] &&
      //   !authorization.roles[0]?.appId) {
      //   throw new Error('The authorization.roles is not populated. To make the login work, provide a populated authorization object.');
      // }

      const token = authorizationToJwt(authorization);
      const expirationDate = new Date();

      expirationDate.setMinutes(expirationDate.getMinutes() + jwtExpiration);

      const rawToken = await this.signToken(token, jwtSecret, expirationDate.getTime() / 1000);

      setCookie(event, tokenCookieName, rawToken);

      return new Guard(decodeJwt(rawToken), eventReader.getTenantId(event));
    },
    // TODO:: refactor, token.exp is already a expiration date
    async signToken(
      token: JsonWebToken,
      secret: string,
      expiration: number | string | Date,
      issuedAt?: number | string | Date
    ) {
      return await new SignJWT(token)
        .setExpirationTime(expiration)
        .setProtectedHeader({alg: JWT_ALGORITHM})
        .setIssuedAt(issuedAt)
        .sign(new TextEncoder().encode(secret));
    },
    logout(event: H3Event) {
      deleteCookie(event, tokenCookieName);
    },
    /**
     * Verifies the token.
     * It is also the only one method to reach the Guard instance. This is by design, to ensure that
     * the token is verified before any other method is called. This prevents security issues.
     *
     * Throws a jose errors if something is wrong with the token
     */
    async verify(event: H3Event) {
      const rawToken = eventReader.getToken(event);

      if (!rawToken) {
        throw new jose.errors.JWSInvalid();
      }

      await jose.jwtVerify(rawToken, new TextEncoder().encode(jwtSecret));

      return new Guard(decodeJwt(rawToken), eventReader.getTenantId(event));
    }
  };
};
