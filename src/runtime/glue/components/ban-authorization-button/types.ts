export type Authorization = {
	_id: string | null;
	isSuperAdmin: boolean | null;
	isBanned: boolean | null;
}

export type ChangeBanStatusRequestBody = {
	authorizationId: string;
	action: 'ban' | 'unban';
};
