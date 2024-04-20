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

	isAdmin(providerId: string, tenantId: string | null = null) {
		if (this.token?.isBanned) {
			return false;
		}

		if (this.token?.isSuperAdmin) {
			return true;
		}

		const provider = (this.token?.providers || [])
			.find((provider) => tenantId ?
				tenantId === provider.tenantId && provider.providerId === providerId :
				provider.providerId === providerId);

		if (provider?.isBanned) {
			return false;
		}

		return !!provider?.isAdmin;
	}

	hasPermissionTo(permission: string[] | string, providerId: string, tenantId: string | null = null) {
		if (this.token?.isBanned) {
			return false;
		}

		const provider = (this.token?.providers || [])
			.find((provider) => tenantId ?
				tenantId === provider.tenantId && provider.providerId === providerId :
				provider.providerId === providerId);

		if (!provider) {
			return !!this.token?.isSuperAdmin;
		}

		if (provider.isBanned) {
			return false;
		}

		if (provider.isAdmin || this.token?.isSuperAdmin) {
			return true;
		}

		if (Array.isArray(permission)) {
			return (provider.permissions || []).some((permissionItem) =>
				permission.some(
					(permissionToFind) => permissionToFind === permissionItem
				)
			);
		}

		return (provider.permissions || []).some(
			(permissionItem) => permissionItem === permission
		);
	}
}
