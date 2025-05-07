import {
  decodeJwt,
} from 'jose';
import {
  Guard,
} from '../guard';
import type {
  JsonWebToken,
} from '../types';
import {
  refreshCookie, useCookie, useRuntimeConfig, computed,
} from '#imports';

export const useGuard = () => {
  const {
    tokenCookieName,
    tenantIdCookieName,
  } = useRuntimeConfig().public.authorizationModule;
  const rawToken = useCookie(tokenCookieName);
  const _tenantId = useCookie<string | null>(tenantIdCookieName, {
    default: () => null,
  });
  const token = computed({
    get(): JsonWebToken | null {
      // TODO:: handle error and parse / validate JsonWebToken type
      return rawToken.value ? decodeJwt(rawToken.value) : null;
    },
    set() {
      throw new Error('Logic Error: Do not set the token directly. Use the logout method instead ' +
        'or make a login requests and call the refresh function afterwards.');
    },
  });

  // TODO:: validate token content with yup
  return {
    token,
    getRawToken() {
      return rawToken.value;
    },
    logout: () => {
      rawToken.value = null;
    },
    /**
     * Because useCookie does not trigger on cookie changes through a Set-Cookie header in
     * a login response, a manual call must be triggered to refresh the token.
     * It gives all watchers, which have an eye on the cookie, the chance to react.
     */
    refresh() {
      refreshCookie(tokenCookieName);
    },
    isLoggedIn() {
      return new Guard(token.value, _tenantId.value).isLoggedIn();
    },
    isBanned() {
      return new Guard(token.value, _tenantId.value).isBanned();
    },
    hasPermissionTo(permission: string[] | string) {
      return new Guard(token.value, _tenantId.value).hasPermissionTo(permission);
    },
    /**
     * To keep the browser session, token and server in sync, the tenantId must be set.
     * Only one time on app start, may after the login, the tenantId must be set.
     */
    setTenantId(tenantId: string | null) {
      _tenantId.value = tenantId;
    },
    getTenantId(): string | null {
      return _tenantId.value;
    },
  };
};
