import {
  defineSchema,
} from '@antify/database';
import type {
  HydratedDocument,
} from 'mongoose';
import type {
  Role as _Role,
} from '../../../../../src/runtime/server/types';
import {
  Schema,
} from 'mongoose';

export type Role = HydratedDocument<_Role>;

export const ROLE_SCHEMA_NAME = 'authorization_roles';

export const defineRoleSchema = defineSchema(() => {
  return {
    name: 'authorization_roles',
    schema: new Schema({
      name: {
        type: String,
        required: true,
      },
      isAdmin: {
        type: Boolean,
        required: true,
        default: false,
      },
      permissions: [
        {
          type: String,
          required: true,
        },
      ],
    }),
  };
});
