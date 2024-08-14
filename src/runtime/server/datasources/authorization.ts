import {type Document, type SchemaDefinition} from 'mongoose';
import {type AppAccess, useAppAccessSchema} from './appAccess';

export interface Authorization {
  _id: string;
  isSuperAdmin: boolean;
  isBanned: boolean;
  appAccesses: AppAccess[];
}

export type AuthorizationDocument = Document<string, undefined, Authorization>
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

