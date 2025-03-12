import {defineSchema} from '@antify/database';
import type {HydratedDocument, Types} from 'mongoose';

export interface Role {
  _id: Types.ObjectId;
  isAdmin: boolean;
  name: string;
  permissions: string[];
}

export type RoleDocument = HydratedDocument<Role>

export const ROLE_SCHEMA_NAME = 'authorization_roles';

export default defineSchema(async (client) => {
  client.getSchema(ROLE_SCHEMA_NAME).add({
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
