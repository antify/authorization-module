import * as jose from 'jose';
import {Guard} from '../guard';
import {type H3Event} from 'h3';
import {decodeJwt, SignJWT} from 'jose';
import {useRuntimeConfig, getCookie, setCookie, deleteCookie} from '#imports';
import {type Authorization, type JsonWebToken, type Role} from '../types';

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
    isSuperAdmin: authorization.isSuperAdmin,
    isBanned: authorization.isBanned,
    apps: authorization.appAccesses.map(appAccess => ({
      appId: appAccess.appId,
      tenantId: appAccess.tenantId,
      isAdmin: emitValuesFromRoles(appAccess.roles).isAdmin,
      isBanned: appAccess.isBanned,
      permissions: emitValuesFromRoles(appAccess.roles).permissions
    }))
  };
};

export const useAuth = () => {
  const {
    jwtExpiration,
    jwtSecret,
    tokenCookieName
  } = useRuntimeConfig().authorizationModule;

  return {
    async login(event: H3Event, authorization: Authorization) {
      if (authorization.appAccesses[0]?.roles[0] &&
        !authorization.appAccesses[0].roles[0]?.appId) {
        throw new Error('The authorization.appAccesses.roles is not populated. To make the login work, provide a populated authorization object.');
      }

      const token = authorizationToJwt(authorization);
      const expirationDate = new Date();

      expirationDate.setMinutes(expirationDate.getMinutes() + jwtExpiration);

      const rawToken = await this.signToken(token, jwtSecret, expirationDate.getTime() / 1000);

      setCookie(event, tokenCookieName, rawToken);

      return new Guard(decodeJwt(rawToken));
    },
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
     * Throws one of following jose errors if something is wrong with the token:
     * https://github.com/panva/jose/tree/main/docs/classes
     */
    async verify(event: H3Event) {
      const rawToken = event.headers['authorization'] ||
        getCookie(event, tokenCookieName);

      if (!rawToken) {
        throw new jose.errors.JWSInvalid();
      }

      await jose.jwtVerify(rawToken, new TextEncoder().encode(jwtSecret));

      return new Guard(decodeJwt(rawToken));
    }
  };
};
