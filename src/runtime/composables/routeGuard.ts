import {
  useGuard,
  useNuxtApp,
  navigateTo,
  abortNavigation,
  appHandlerFactory,
} from '#imports';

/**
 * Middleware helper function to protect a page from authentications which are
 * not logged in, banned or not having the right permissions.
 *
 * It also checks the tenantId stored in cookie with the tokens tenantId to make sure
 * a user does not enter restricted terrain.
 *
 * Use this composable in the middleware of a page to protect it like:
 * ```ts
 * definePageMeta({
 *  middleware: [
 *    function (to) {
 *      return useRouteGuard('CAN_READ_SECRET_DATA');
 *    }
 *  ]
 * });
 * ```
 *
 * @param permissions => Permissions required to access the page
 */
export const useRouteGuard = (
  permissions?: string[] | string
) => {
  const {$uiModule} = useNuxtApp();
  const unauthorizedMessage = 'Unauthorized - Configure a loginPageRoute in app handler \nto automatically redirect unauthorized users to login page.';
  const jailMessage = 'Banned - Configure a jailPageRoute in app handler \nto automatically redirect banned users to jail page.';
  const invalidPermissionsMessage = 'Unauthorized - You do not have the required permissions to access this page.\nPlease contact your administrator.';
  const guard = useGuard();
  const appHandler = appHandlerFactory(guard.getTenantId());

  // Check if is authorized
  if (!guard.isLoggedIn()) {
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

  // Check if authorization is banned
  if (guard.isBanned()) {
    if (appHandler?.onBanned) {
      return appHandler.onBanned();
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

  // Check permissions if provided
  if (permissions && !guard.hasPermissionTo(permissions)) {
    // On route change
    $uiModule.toaster.toastError(invalidPermissionsMessage);

    // On initial page load
    return abortNavigation({
      statusCode: 403,
      message: invalidPermissionsMessage
    });
  }
};
