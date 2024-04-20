import type {JWTPayload} from 'jose';

export type Permission = {
	id: string
	name: string
}
export type JsonWebToken = {
	id?: string,
	isSuperAdmin?: boolean;
	isBanned?: boolean;
	providers?: JsonWebTokenProvider[];
} & JWTPayload;
export type JsonWebTokenProvider = {
	providerId: string;
	tenantId: string | null;
	isAdmin: boolean;
	isBanned: boolean;
	permissions: string[];
}
export type {DabaseHandler} from './server/database-handler';

export type {Authorization} from './server/datasources/authorization';
export type {ProviderAccess} from './server/datasources/providerAccess';
export type {Role} from './server/datasources/schemas/role';
