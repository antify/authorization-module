import {type Role} from './schemas/role';
import {
  type SchemaDefinition,
  Types,
  Schema
} from 'mongoose';

export interface AppAccess {
  _id: Types.ObjectId;
  appId: string;
  tenantId: string | null;
  roles: Role[];
  isBanned: boolean;
}

export const useAppAccessSchema = (roleSchemaName: string): SchemaDefinition => ({
  appId: {
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
      ref: roleSchemaName
    }],
    required: true,
    default: [],
    validate: (val: Types.ObjectId[]) => {
      const duplicates = val.filter(
        (item, index) =>
          val.some((_item, _index) => _item.toString() === item.toString() && _index !== index)
      );

      if (duplicates.length > 0) {
        throw new Error(`Can not associate one AppAccess one role multiple times. Duplicate role ids found: ${duplicates.join(', ')}`);
      }
    }
  },
  isBanned: {
    type: Boolean,
    required: true,
    default: false
  }
});
