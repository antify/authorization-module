import {defineDatabaseHandler, type Role} from '#authorization-module';
import {type SingleConnectionClient, getDatabaseClient as _getDatabaseClient} from '@antify/database';
import {type User} from './schemas/user';

export default defineDatabaseHandler({
	async getMainDatabaseClient() {
		return (await _getDatabaseClient('core') as SingleConnectionClient).connect()
	},
	async findOneAuthorization(id: string) {
		const client = await this.getMainDatabaseClient();
		const user = await client.getModel<User>('users')
			.findOne({
				'authorization._id': id
			})
			.populate({
				path: 'authorization.appAccesses.roles',
				model: client.getModel<Role>('authorization_roles')
			});

		if (!user) {
			return null;
		}

		return user.authorization;
	},
	async updateAuthorization(authorization) {
		const client = await this.getMainDatabaseClient();
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
