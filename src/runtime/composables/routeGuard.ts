import {
	useGuard,
	useNuxtApp,
	navigateTo,
	abortNavigation,
	appHandlerFactory,
} from '#imports';
import type {AppContext} from '#app-context-module/types';

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
 * @param appContext => The app context which should be protected
 * @param permissions => Permissions required to access the page
 */
export const useRouteGuard = (
	appContext: AppContext,
	permissions?: string[] | string
) => {
	const {$uiModule} = useNuxtApp();
	const unauthorizedMessage = 'Unauthorized - Configure a loginPageRoute in nuxt config \nto automatically redirect unauthorized users to login page.';
	const jailMessage = 'Banned - Configure a jailPageRoute in nuxt config \nto automatically redirect banned users to jail page.';
	const invalidPermissionsMessage = 'Unauthorized - You do not have the required permissions to access this page.\nPlease contact your administrator.';
	const appHandler = appHandlerFactory(appContext.appId, appContext.tenantId);

	// Check if is authorized
	if (!useGuard().isLoggedIn()) {
		if (appHandler?.onUnauthorized) {
			return appHandler.onUnauthorized();
		}

		if (appHandler?.loginPageRoute) {
			return navigateTo(appHandler.loginPageRoute);
		}

		// On route change
		$uiModule.toaster.toastError(unauthorizedMessage);

		// On initial page load
		return abortNavigation({
			statusCode: 401,
			message: unauthorizedMessage
		});
	}

	// Check if authorization is banned system-wide
	if (useGuard().token.value?.isBanned === true) {
		if (appHandler?.onBannedSystemWide) {
			return appHandler.onBannedSystemWide();
		}

		if (appHandler?.jailPageRoute) {
			return navigateTo(appHandler.jailPageRoute);
		}

		// On route change
		$uiModule.toaster.toastError(jailMessage);

		// On initial page load
		return abortNavigation({
			statusCode: 403,
			message: jailMessage
		});
	}

	// Check if authorization is banned in app context
	if (useGuard().token.value?.apps?.some(app =>
		app.appId === appContext.appId && app.tenantId === appContext.tenantId && app.isBanned === true)) {
		if (appHandler?.onBannedInApp) {
			return appHandler.onBannedInApp();
		}

		if (appHandler?.appJailPageRoute) {
			return navigateTo(appHandler.appJailPageRoute);
		}

		// On route change
		$uiModule.toaster.toastError(jailMessage);

		// On initial page load
		return abortNavigation({
			statusCode: 403,
			message: jailMessage
		});
	}

	// Check permissions if provided
	if (permissions && !useGuard().hasPermissionTo(permissions, appContext.appId, appContext.tenantId)) {
		// On route change
		$uiModule.toaster.toastError(invalidPermissionsMessage);

		// On initial page load
		return abortNavigation({
			statusCode: 403,
			message: invalidPermissionsMessage
		});
	}
}

/**
 * Middleware like useRouteGuard but with the app context from the appContext composable.
 *
 * @param permissions => Permissions required to access the page
 */
export const useAppContextRouteGuard = (permissions?: string[] | string) => {
	const {context} = useNuxtApp().$appContextModule;

	if (!context) {
		throw new Error('App context is not available. Make sure an appContext is set before calling useAppContextRouteGuard.');
	}

	return useRouteGuard(context, permissions);
}
