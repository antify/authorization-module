import type {JWTPayload} from 'jose';

export type Permission = {
  id: string
  name: string

  /**
   * List of apps the permission is associated.
   * If empty, the permission is global available for all apps.
   */
  appIds?: string[]
};
export type App = {
  id: string
  isMultiTenant?: boolean

  /**
   * The app where all roles and authorizations are stored.
   * For example an auth app or administration app.
   */
  isMainApp?: boolean
}
export type JsonWebToken = {
  id?: string,
  isSuperAdmin?: boolean;
  isBanned?: boolean;
  apps?: JsonWebTokenApp[];
} & JWTPayload;
export type JsonWebTokenApp = {
  appId: string;
  tenantId: string | null;
  isAdmin: boolean;
  isBanned: boolean;
  permissions: string[];
};
export type {AppHandlerFactory, AppHandler} from './composables/appHandler';
export type {DatabaseHandler} from './server/databaseHandler';
export type {Authorization} from './server/datasources/authorization';
export type {AppAccess} from './server/datasources/appAccess';
export type {Role} from './server/datasources/schemas/role';
