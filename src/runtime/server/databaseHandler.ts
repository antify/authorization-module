import type {
  H3Event,
} from 'h3';
import type {
  Authorization, Role,
} from './types';

export type DatabaseHandler = {
  findOneAuthorization(id: string, tenantId: string | null): Promise<Authorization | null>;
  updateAuthorization(authorization: Authorization, tenantId: string | null): Promise<void>;
  deleteRoleById(id: string, tenantId: string | null, event: H3Event): Promise<void>;
  saveRole(role: Role, tenantId: string | null): Promise<void>;
  findRoleById(id: string, tenantId: string | null): Promise<Role | null>;
  findRoles(
    sort?: {
      sort?: string;
      sortDirection?: 'asc' | 'desc';
    },
    filter?: {
      name?: string;
    },
    pagination?: {
      page: number;
      itemsPerPage: number;
    },
    tenantId?: string
  ): Promise<Role[]>;
  countRoles(filter?: {
    name?: string | null;
  }, tenantId?: string): Promise<number>;
};

export const defineDatabaseHandler = (databaseHandler: DatabaseHandler): DatabaseHandler => databaseHandler;
