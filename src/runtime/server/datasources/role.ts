import type {Document, SchemaDefinition} from 'mongoose';

export interface Role {
  _id: string;
  isAdmin: boolean;
  name: string;
  permissions: string[];
  appId: string;
  tenantId: string | null;
}

export type RoleDocument = Document<string, undefined, Role>
export const useRoleSchema = (): SchemaDefinition => ({
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
