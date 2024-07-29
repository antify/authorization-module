import * as jose from 'jose';
import {Guard} from '../guard';
import type {JsonWebToken, Permission} from '../types';
import {refreshCookie, useCookie, useRuntimeConfig, computed} from '#imports';

export const useGuard = () => {
  const {tokenCookieName, permissions} = useRuntimeConfig().public.authorizationModule;
  const rawToken = useCookie(tokenCookieName);
  const token = computed({
    get(): JsonWebToken | null {
      // TODO:: handle error and parse / validate JsonWebToken type
      return rawToken.value ? jose.decodeJwt(rawToken.value) : null;
    },
    set() {
      throw new Error('Logic Error: Do not set the token directly. Use the logout method instead ' +
        'or make a login requests and call the refresh function afterwards.');
    }
  });

  // TODO:: validate token content with @antify/validate

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
      return new Guard(token.value).isLoggedIn();
    },
    hasPermissionTo(permission: string[] | string, appId: string, tenantId: string | null = null) {
      return new Guard(token.value).hasPermissionTo(permission, appId, tenantId);
    },
    // TODO:: implement in dev component
    getAppPermissions(appId: string): Permission[] {
      return permissions.filter((permission: Permission) => permission.appIds?.includes(appId) || !permission.appIds);
    }
  };
};
