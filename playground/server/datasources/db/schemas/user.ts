import {
  defineSchema,
} from '@antify/database';
import type {
  Authorization,
} from '../../../../../src/runtime/server/datasources/authorization'; // TODO:: import from #authorization-module
import {
  type HydratedDocument,
  type SchemaDefinition,
  type Types,
  Schema,
} from 'mongoose';
import {
  ROLE_SCHEMA_NAME,
} from './role';

export type User = HydratedDocument<{
  _id: string;
  name: string;
  authorization: Authorization;
}>;

const useAuthorizationSchema = (): SchemaDefinition => {
  const schema = new Schema({
    roles: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: ROLE_SCHEMA_NAME,
        },
      ],
      required: true,
      default: [],
      validate: (val: Types.ObjectId[]) => {
        const duplicates = val.filter((item, index) => val.some((_item, _index) => _item.toString() === item.toString() && _index !== index));

        if (duplicates.length > 0) {
          throw new Error(`Can not associate one AppAccess one role multiple times. Duplicate role ids found: ${duplicates.join(', ')}`);
        }
      },
    },
    isBanned: {
      type: Boolean,
      required: true,
      default: false,
    },
  });

  schema.virtual('isAdmin').get(function (this: Authorization) {
    return this.roles.some(role => role.isAdmin);
  });

  schema.virtual('allPermissions').get(function (this: Authorization) {
    return this.roles.reduce((permissions, role) => {
      return permissions.concat(role.permissions);
    }, []);
  });

  return schema;
};

export const defineUserSchema = defineSchema(() => {
  return {
    name: 'users',
    schema: new Schema({
      name: {
        type: String,
        required: true,
      },
      authorization: {
        type: useAuthorizationSchema(),
        required: true,
        unique: true,
        default: {
          isAdmin: false,
          isBanned: false,
        },
      },
    }),
  };
});
