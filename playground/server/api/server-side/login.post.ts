import type {H3Event} from 'h3';
import {useDatabaseClient} from '#database-module';
import {defineEventHandler, readBody} from '#imports';
import {type User} from '~/server/datasources/db/core/schemas/user';
import {useAuth, type Role} from '#authorization-module';

export default defineEventHandler(async (event: H3Event) => {
	const userId = (await readBody(event)).userId;

	if (!userId) {
		throw new Error('Missing userId');
	}

	const client = await useDatabaseClient(event);
	const user = await client.getModel<User>('users')
		.findOne({_id: userId})
		.populate({
			path: 'authorization.providerAccesses.roles',
			model: client.getModel<Role>('authorization_roles')
		});

	if (!user) {
		throw new Error('User not found');
	}

	await useAuth().login(event, user.authorization);

	return {success: true}
});
