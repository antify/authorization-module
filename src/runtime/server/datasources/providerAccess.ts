import {type Role} from './schemas/role';
import {
	type SchemaDefinition,
	type Document,
	Schema
} from 'mongoose';

export interface ProviderAccess {
	_id: string;
	providerId: string;
	tenantId: string | null;
	roles: Role[];
	isBanned: boolean;
}

export type ProviderAccessDocument = Document<string, undefined, ProviderAccess>

export const providerAccessSchemaDefinition: SchemaDefinition = {
	providerId: {
		type: String,
		required: true
	},
	tenantId: {
		type: String,
		required: false
	},
	roles: {
		type: [{
			type: Schema.Types.ObjectId,
			ref: 'authorization_roles'
		}],
		required: true,
		default: [],
		validate: (val: Schema.Types.ObjectId[]) => {
			const duplicates = val.filter(
				(item, index) =>
					val.some((_item, _index) => _item.toString() === item.toString() && _index !== index)
			);

			if (duplicates.length > 0) {
				throw new Error(`Can not accociate one ProviderAccess one role multiple times. Duplicate role ids found: ${duplicates.join(', ')}`);
			}
		}
	},
	isBanned: {
		type: Boolean,
		required: true,
		default: false
	}
};
