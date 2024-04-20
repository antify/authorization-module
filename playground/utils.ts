import {type JsonWebToken} from '#authorization-module';
import {permissions} from './glue/permissions';

export const defaultToken: JsonWebToken = {
	id: 'an-user-id',
	isSuperAdmin: false,
	providers: [
		{
			providerId: 'core',
			tenantId: null,
			isAdmin: false,
			permissions: permissions.map(permission => permission.id)
		}, {
			providerId: 'tenant',
			tenantId: '63e398316c6c22a1f5479ab6',
			isAdmin: false,
			permissions: permissions.map(permission => permission.id)
		}
	]
};
