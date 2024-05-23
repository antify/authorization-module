import {defineSchema} from '@antify/database';
import type {Document} from 'mongoose';

export interface Role {
	_id: string;
	isAdmin: boolean;
	name: string;
	permissions: string[];
	appId: string;
	tenantId: string | null;
}
export type RoleDocument = Document<string, undefined, Role>

export default defineSchema(async (client) => {
	client.getSchema('authorization_roles').add({
		appId: {
			type: String,
			required: true
		},
		tenantId: {
			type: String,
			required: false
		},
		name: {
			type: String,
			required: true
		},
		isAdmin: {
			type: Boolean,
			required: true,
			default: false
		},
		permissions: [
			{
				type: String,
				required: true
			}
		]
	});
});
