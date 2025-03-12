import {Schema, type SchemaDefinition, Types} from 'mongoose';
import type {Role} from '~/src/runtime/server/datasources/schemas/role';

export interface Authorization {
  _id: Types.ObjectId;
  tenantId: string | null;
  roles: Role[];
  isBanned: boolean;

  /**
   * Virtual field to check if the authorization is an admin
   */
  isAdmin: boolean;

  /**
   * Virtual field to get all permissions of the authorization
   */
  allPermissions: string[];
}

export const useAuthorizationSchema = (roleSchemaName: string = 'authorization_roles'): SchemaDefinition => {
  const schema = new Schema({
    tenantId: {
      type: String,
      default: null
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
