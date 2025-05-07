import {
  useDatabaseClient,
} from '#database-module';
import {
  defineDatabaseHandler,
} from '#authorization-module';
import {
  defineUserSchema,
} from './schemas/user';
import type {
  FilterQuery,
} from 'mongoose';
import {
  defineRoleSchema,
} from '~/server/datasources/db/schemas/role';
import {
  Error,
} from 'mongoose';
import type {
  Role,
} from '../../../../src/runtime/server/types';

export default defineDatabaseHandler({
  getDatabaseClient: async function (tenantId: string | null) {
    return await useDatabaseClient('app', tenantId);
  },
  async findOneAuthorization(id: string, tenantId: string | null) {
    const client = await this.getDatabaseClient(tenantId);
    const user = await client.getModel(defineUserSchema)
      .findOne({
        'authorization._id': id,
      })
      .populate({
        path: 'authorization.roles',
        model: client.getModel(defineRoleSchema),
      });

    if (!user) {
      return null;
    }

    return user.authorization;
  },
  async updateAuthorization(authorization, tenantId: string | null) {
    const client = await this.getDatabaseClient(tenantId);
    const user = await client.getModel(defineUserSchema)
      .findOne({
        'authorization._id': authorization._id,
      });

    if (!user) {
      return;
    }

    user.authorization = authorization;

    await user.save();
  },
  async deleteRoleById(id: string, tenantId: string | null): Promise<void> {
    const client = await this.getDatabaseClient(tenantId);
    const RoleModel = client.getModel(defineRoleSchema);

    await RoleModel.deleteOne({
      _id: id,
    });
  },
  async saveRole(role: Role, tenantId: string | null): Promise<Role | null> {
    const client = await this.getDatabaseClient(tenantId);
    const RoleModel = client.getModel(defineRoleSchema);

    // On update
    if (role._id !== null) {
      const _role = await this.findRoleById(role._id, tenantId);

      if (!_role) {
        return null;
      }
    }

    const _role = new RoleModel({
      ...role,
      _id: undefined,
    });

    // On update
    if (role._id !== null) {
      _role.isNew = false;
      _role._id = role._id;
    }

    try {
      await _role.save();
    } catch (e) {
      if (e?.constructor?.name === Error.DocumentNotFoundError.name) {
        return null;
      }

      throw e;
    }

    return _role;
  },
  async findRoleById(id: string, tenantId: string | null) {
    const client = await this.getDatabaseClient(tenantId);
    const RoleModel = client.getModel(defineRoleSchema);

    return await RoleModel.findById(id);
  },
  async findRoles(
    sort?: {
      sort?: string;
      sortDirection?: 'asc' | 'desc';
    },
    filter?: {
      name?: string | null;
    },
    pagination?: {
      page: number;
      itemsPerPage: number;
    },
    tenantId?: string,
  ): Promise<{
      roles: Role[];
      count: number;
    }> {
    const client = await this.getDatabaseClient(tenantId);
    const RoleModel = client.getModel(defineRoleSchema);
    const query: FilterQuery<Role> = {};

    if (filter?.name) {
      query.name = {
        $regex: filter.name,
        $options: 'i',
      };
    }

    if (pagination?.page !== undefined || pagination?.itemsPerPage !== undefined) {
      return RoleModel.find(query)
        .skip((pagination.page - 1) * pagination.itemsPerPage)
        .limit(pagination.itemsPerPage)
        .collation({
          locale: 'en',
        })
        .sort({
          [sort?.sort ?? 'name']: sort?.sortDirection === 'desc' ? -1 : 1,
        });
    }

    return RoleModel.find(query)
      .collation({
        locale: 'en',
      })
      .sort({
        [sort?.sort ?? 'name']: sort?.sortDirection === 'desc' ? -1 : 1,
      });
  },
  async countRoles(filter?: {
    name?: string | null;
  }, tenantId?: string) {
    const client = await this.getDatabaseClient(tenantId);
    const query: FilterQuery<Role> = {};

    if (filter?.name) {
      query.name = {
        $regex: filter.name,
        $options: 'i',
      };
    }

    return client.getModel(defineRoleSchema).countDocuments(query);
  },
});
