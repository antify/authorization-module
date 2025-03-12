import type {NavigationFailure, RouteLocationRaw} from '#vue-router';

/**
 * Client side app handler to configure and handle unauthorized, banned and permission errors.
 */
export interface AppHandler {
  /**
   * Route to redirect to, if the user is not logged in.
   * If not set, the user will be redirected to the default nuxt error page.
   */
  loginPageRoute?: RouteLocationRaw;

  /**
   * Route to redirect to, if the user is banned.
   * If not set, the user will be redirected to the default nuxt error page.
   */
  jailPageRoute?: RouteLocationRaw;

  /**
   * Callback if the user is not logged in.
   * Return a `navigateTo` to redirect or `false` to abort the navigation.
   * On returning void, the user can see the page.
   */
  onUnauthorized?: () => Promise<void | NavigationFailure | false> | false | void | RouteLocationRaw;

  /**
   * Callback if the user is banned.
   * Return a `navigateTo` to redirect or `false` to abort the navigation.
   * On returning void, the user can see the page.
   */
  onBanned?: () => Promise<void | NavigationFailure | false> | false | void | RouteLocationRaw;
}

export type AppHandlerFactory = (tenantId: string | null) => AppHandler;

export const defineAppHandlerFactory = (factory: AppHandlerFactory): AppHandlerFactory => {
  return factory;
};
