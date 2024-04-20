import * as jose from 'jose';
import {Guard} from '../guard';
import type {JsonWebToken} from '../types';
import {refreshCookie, useCookie, useRuntimeConfig} from '#imports';
import {computed} from 'vue';

export const useGuard = () => {
	const {tokenCookieName} = useRuntimeConfig().public.authorizationModule;
	const rawToken = useCookie(tokenCookieName)
	const token = computed({
		get(): JsonWebToken | null {
			// TODO:: handle error and parse / validate JsonWebToken type
			return rawToken.value ? jose.decodeJwt(rawToken.value) : null
		},
		set() {
			throw new Error('Logic Error: Do not set the token directly. Use the logout method instead ' +
				'or make a login requests and call the refresh function afterwards.');
		}
	})

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
		 */
		refresh() {
			refreshCookie(tokenCookieName)
		},
		isLoggedIn() {
			return new Guard(token.value).isLoggedIn()
		},
		hasPermissionTo(permission: string[] | string, providerId: string, tenantId: string | null = null) {
			return new Guard(token.value).hasPermissionTo(permission, providerId, tenantId)
		}
	};
};
