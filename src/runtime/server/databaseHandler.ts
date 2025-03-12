import {type Authorization} from '../types';
import {SingleConnectionClient} from '@antify/database';

export type DatabaseHandler = {
  getDatabaseClient(tenantId: string | null): Promise<SingleConnectionClient>
  findOneAuthorization(id: string, tenantId: string | null): Promise<Authorization | null>
  updateAuthorization(authorization: Authorization, tenantId: string | null): Promise<void>
}

export const defineDatabaseHandler = (databaseHandler: DatabaseHandler): DatabaseHandler => databaseHandler;
