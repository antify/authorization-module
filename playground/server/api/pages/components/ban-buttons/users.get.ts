import type {H3Event} from 'h3';
import {useDatabaseClient} from '#database-module';
import {defineEventHandler} from '#imports';
import {User} from '~/server/datasources/db/core/schemas/user';

export default defineEventHandler(async (event: H3Event) => {
	const client = await useDatabaseClient(event)

	return await client.getModel<User>('users').find({})
		.populate({
			path: 'authorization.providerAccesses.roles',
			model: client.getModel('authorization_roles')
		})
		.sort('name');
});
