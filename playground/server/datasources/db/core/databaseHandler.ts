import {defineDatabaseHandler, type Role} from '#authorization-module';
import {type SingleConnectionClient, getDatabaseClient as _getDatabaseClient} from '@antify/database';
import {type User} from './schemas/user';

async function getDatabaseClient() {
	return (await _getDatabaseClient('core') as SingleConnectionClient).connect();
}

export default defineDatabaseHandler({
	findOneAuthorization: async (id: string) => {
		const client = await getDatabaseClient();
		const user = await client.getModel<User>('users')
			.findOne({
				'authorization._id': id
			})
			.populate({
				path: 'authorization.providerAccesses.roles',
				model: client.getModel<Role>('authorization_roles')
			});

		if (!user) {
			return null;
		}

		return user.authorization;
	},
	updateAuthorization: async (authorization) => {
		const client = await getDatabaseClient();
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
