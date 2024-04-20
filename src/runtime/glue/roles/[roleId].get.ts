export type Role = {
    isAdmin: boolean;
    name: string;
    permissions: string[];
    providerId: string;
    tenantId: string | null;
}
