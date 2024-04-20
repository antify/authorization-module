import {refreshCookie, useRuntimeConfig} from '#imports';

/**
 * Give all watchers, which have an eye on the cookie, the chance to react.
 * Call this method if the token got changed by http response header.
 */
export const refreshTokenCookie = () => {
	refreshCookie(useRuntimeConfig().public.authorizationModule.tokenCookieName);
}
