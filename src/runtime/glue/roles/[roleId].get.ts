export type Role = {
  isAdmin: boolean;
  name: string;
  permissions: string[];
  appId: string;
  tenantId: string | null;
}
