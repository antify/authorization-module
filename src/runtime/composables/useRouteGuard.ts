import {
	useRuntimeConfig,
	abortNavigation,
	navigateTo,
	useNuxtApp,
	useGuard
} from '#imports';

/**
 * Middleware helper function to protect a page from authentications which are
 * not logged in, banned or not having the right permissions.
 *
 * Use this composable in the middleware of a page to protect it like:
 * ```ts
 * definePageMeta({
 * 	middleware: [
 * 		function (to) {
 * 			return useRouteGuard('tenant', (to.params?.tenantId || null) as string | null, 'CAN_READ_SECRET_DATA');
 * 		}
 * 	]
 * });
 * ```
 *
 * @param providerId => The provider context which should be protected
 * @param tenantId => The tenant context which should be protected if the provider is multi-tenant
 * @param permissions => Permissions required to access the page
 */
export const useRouteGuard = (
	providerId: string,
	tenantId: string | null = null,
	permissions?: string[] | string
) => {
	const {
		loginPageRoute,
		jailPageRoute,
		providerJailPageRoute
	} = useRuntimeConfig().public.authorizationModule;
	const {$uiModule} = useNuxtApp();
	const unauthorizedMessage = 'Unauthorized - Configure a loginPageRoute in nuxt config \nto automatically redirect unauthorized users to login page.';
	const jailMessage = 'Banned - Configure a jailPageRoute in nuxt config \nto automatically redirect banned users to jail page.';
	const invalidPermissionsMessage = 'Unauthorized - You do not have the required permissions to access this page.\nPlease contact your administrator.';

	// Check if is authorized
	if (!useGuard().isLoggedIn()) {
		if (loginPageRoute) {
			return navigateTo(loginPageRoute);
		}

		// On route change
		$uiModule.toaster.toastError(unauthorizedMessage);

		// On initial page load
		return abortNavigation({
			statusCode: 401,
			statusMessage: unauthorizedMessage
		});
	}

	// Check if authorization is banned system-wide
	if (useGuard().token.value?.isBanned === true) {
		if (jailPageRoute) {
			return navigateTo(jailPageRoute);
		}

		// On route change
		$uiModule.toaster.toastError(jailMessage);

		// On initial page load
		return abortNavigation({
			statusCode: 403,
			statusMessage: jailMessage
		});
	}

	// Check if authorization is banned in provider context
	if (useGuard().token.value?.providers?.some(provider =>
		provider.providerId === providerId && provider.tenantId === tenantId && provider.isBanned === true)) {
		if (providerJailPageRoute) {
			return navigateTo(providerJailPageRoute);
		}

		// On route change
		$uiModule.toaster.toastError(jailMessage);

		// On initial page load
		return abortNavigation({
			statusCode: 403,
			statusMessage: jailMessage
		});
	}

	// Check permissions if provided
	if (permissions && !useGuard().hasPermissionTo(permissions, providerId, tenantId)) {
		// On route change
		$uiModule.toaster.toastError(invalidPermissionsMessage);

		// On initial page load
		return abortNavigation({
			statusCode: 403,
			statusMessage: invalidPermissionsMessage
		});
	}
}
