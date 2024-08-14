import type {JsonWebToken} from './types';

/**
 * Using one guard for client and server side to ensure the same logic is used.
 */
export class Guard {
  constructor(protected token: JsonWebToken | null) {
  }

  getToken(): JsonWebToken | null {
    return this.token;
  }

  getId(): string | null {
    return this.token?.id || null;
  }

  isLoggedIn(): boolean {
    if (this.token === null) {
      return false;
    }

    // Make sure token is not expired
    if (!this.token.exp) {
      return false;
    }

    return this.token.exp * 1000 > Date.now();
  }

  isSuperAdmin(): boolean {
    if (this.token?.isBanned) {
      return false;
    }

    return this.token?.isSuperAdmin || false;
  }

  isAdmin(appId: string, tenantId: string | null = null) {
    if (this.token?.isBanned) {
      return false;
    }

    if (this.token?.isSuperAdmin) {
      return true;
    }

    const app = (this.token?.apps || [])
      .find((app) => tenantId ?
        tenantId === app.tenantId && app.appId === appId :
        app.appId === appId);

    if (app?.isBanned) {
      return false;
    }

    return !!app?.isAdmin;
  }

  hasPermissionTo(permission: string[] | string, appId: string, tenantId: string | null = null) {
    if (this.token?.isBanned) {
      return false;
    }

    const app = (this.token?.apps || [])
      .find((app) => tenantId ?
        tenantId === app.tenantId && app.appId === appId :
        app.appId === appId);

    if (!app) {
      return !!this.token?.isSuperAdmin;
    }

    if (app.isBanned) {
      return false;
    }

    if (app.isAdmin || this.token?.isSuperAdmin) {
      return true;
    }

    if (Array.isArray(permission)) {
      return (app.permissions || []).some((permissionItem) =>
        permission.some(
          (permissionToFind) => permissionToFind === permissionItem
        )
      );
    }

    return (app.permissions || []).some(
      (permissionItem) => permissionItem === permission
    );
  }

  /**
   * Return the amount of app access for the given appId.
   * Single tenancy apps will be 1 or 0, multi tenancy apps can
   * be 0 or *.
   */
  hasAppAccess(appId: string): number {
    if (!this.token) {
      return 0;
    }

    return this.token.apps?.filter((app) => app.appId === appId).length || 0;
  }
}
