import {type Document, type SchemaDefinition} from 'mongoose';
import {type ProviderAccess, providerAccessSchemaDefinition} from './providerAccess';

export interface Authorization {
	_id: string;
	isSuperAdmin: boolean;
	isBanned: boolean;
	providerAccesses: ProviderAccess[];
}
export type AuthorizationDocument = Document<string, undefined, Authorization>

export const authorizationSchemaDefinition: SchemaDefinition = {
	providerAccesses: {
		type: [providerAccessSchemaDefinition],
		required: true,
		default: []
	},
	isSuperAdmin: {
		type: Boolean,
		required: true,
		default: false
	},
	isBanned: {
		type: Boolean,
		required: true,
		default: false
	}
}
