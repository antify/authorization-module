import {type Authorization} from '../types'
import {SingleConnectionClient} from '@antify/database';

export type DatabaseHandler = {
	findOneAuthorization(id: string): Promise<Authorization | null>
	updateAuthorization(authorization: Authorization): Promise<void>

	/**
	 * Database client where roles are stored.
	 * Needed to automatically handle role CRUD and role assignment components.
	 */
	getMainDatabaseClient(): Promise<SingleConnectionClient>
}

export const defineDatabaseHandler = (databaseHandler: DatabaseHandler): DatabaseHandler => databaseHandler
