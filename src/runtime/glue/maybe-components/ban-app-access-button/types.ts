export type AppAccess = {
  _id: string | null;
  isBanned: boolean | null;
  appId: string | null;
  tenantId: string | null;
  roles: {
    isAdmin: boolean
  }[]
}

export type ChangeBanStatusRequestBody = {
  authorizationId: string;
  appAccessId: string;
  action: 'ban' | 'unban';
};
