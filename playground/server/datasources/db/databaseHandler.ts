import {
  useDatabaseClient,
} from '#database-module';
import {
  defineDatabaseHandler,
  type Role
} from '#authorization-module';
import {type User} from './schemas/user';

export default defineDatabaseHandler({
  getDatabaseClient: async function (tenantId: string | null) {
    return await useDatabaseClient('app', tenantId);
  },
  async findOneAuthorization(id: string, tenantId: string | null) {
    const client = await this.getDatabaseClient(tenantId);
    const user = await client.getModel<User>('users')
      .findOne({
        'authorization._id': id
      })
      .populate({
        path: 'authorization.roles',
        model: client.getModel<Role>('authorization_roles')
      });

    if (!user) {
      return null;
    }

    return user.authorization;
  },
  async updateAuthorization(authorization, tenantId: string | null) {
    const client = await this.getDatabaseClient(tenantId);
    const user = await client.getModel<User>('users')
      .findOne({
        'authorization._id': authorization._id
      });

    if (!user) {
      return;
    }

    user.authorization = authorization;

    await user.save();
  }
});
