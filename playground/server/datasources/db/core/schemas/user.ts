import {defineSchema} from '@antify/database';
import {type Authorization, authorizationSchemaDefinition} from '../../../../../../src/runtime/server/datasources/authorization';

export interface User {
	_id: string;
	name: string;
	authorization: Authorization;
}

export default defineSchema(async (client) => {
	client.getSchema('users').add({
		name: {
			type: String,
			required: true
		},
		authorization: {
			type: authorizationSchemaDefinition,
			required: true,
			unique: true,
			default: {
				isSuperAdmin: false,
				isBanned: false,
				appAccesses: []
			}
		}
	});
});
