import type {JWTPayload} from 'jose';

export type Permission = {
  id: string
  name: string
};
export type JsonWebToken = {
  id?: string; // TODO:: really optional?
  tenantId: string | null;
  isBanned?: boolean; // TODO:: really optional?
  isAdmin: boolean;
  permissions: string[];
} & JWTPayload;
export type {AppHandlerFactory, AppHandler} from './composables/appHandler';
export type {DatabaseHandler} from './server/databaseHandler';
export type {Authorization} from './server/datasources/authorization';
