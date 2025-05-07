import type {
  JsonWebToken,
} from './types';

/**
 * Using one guard for client and server side to ensure the same logic is used.
 */
export class Guard {
  constructor(
    protected token: JsonWebToken | null,
    protected tenantId: string | null,
  ) {
  }

  getToken(): JsonWebToken | null {
    return this.token;
  }

  getTenantId(): string | null {
    return this.tenantId;
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

    // The users token comes from another tenant instance
    if (this.token.tenantId !== this.tenantId) {
      return false;
    }

    return this.token.exp * 1000 > Date.now();
  }

  isAdmin() {
    if (!this.isLoggedIn()) {
      return false;
    }

    if (this.isBanned()) {
      return false;
    }

    return this.token?.isAdmin;
  }

  isBanned() {
    if (!this.isLoggedIn()) {
      return false;
    }

    return this.token?.isBanned || false;
  }

  hasPermissionTo(permission: string[] | string) {
    // TODO:: following log get called 20 times on playground role crud?!?
    // console.log('Checking permission');
    if (!this.isLoggedIn()) {
      return false;
    }

    if (this.isBanned()) {
      return false;
    }

    if (this.isAdmin()) {
      return true;
    }

    if (Array.isArray(permission)) {
      return (this.token?.permissions || []).some((permissionItem) => permission.some((permissionToFind) => permissionToFind === permissionItem));
    }

    return (this.token?.permissions || []).some((permissionItem) => permissionItem === permission);
  }
}
