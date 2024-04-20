import {type Authorization} from '../types'

export type DatabaseHandler = {
	findOneAuthorization(id: string): Promise<Authorization | null>
	updateAuthorization(authorization: Authorization): Promise<void>
}

export const defineDatabaseHandler = (databaseHandler: DatabaseHandler): DatabaseHandler => databaseHandler
