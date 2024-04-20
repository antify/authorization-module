export type ProviderAccess = {
	_id: string | null;
	isBanned: boolean | null;
	providerId: string | null;
	tenantId: string | null;
	roles: {
		isAdmin: boolean
	}[]
}

export type ChangeBanStatusRequestBody = {
	authorizationId: string;
	providerAccessId: string;
	action: 'ban' | 'unban';
};
