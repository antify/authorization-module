import {type AppAccess, useAppAccessSchema} from './appAccess';
import {type SchemaDefinition, Types} from 'mongoose';

export interface Authorization {
  _id: Types.ObjectId;
  isSuperAdmin: boolean;
  isBanned: boolean;
  appAccesses: AppAccess[];
}

export const useAuthorizationSchema = (roleSchemaName: string = 'authorization_roles'): SchemaDefinition => ({
  appAccesses: {
    type: [useAppAccessSchema(roleSchemaName)],
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
});

