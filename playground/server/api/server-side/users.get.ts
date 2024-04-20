import type {H3Event} from 'h3';
import {useDatabaseClient} from '#database-module';
import {defineEventHandler} from '#imports';
import {User} from '~/server/datasources/db/core/schemas/user';

export default defineEventHandler(async (event: H3Event) => {
	const userModel = (await useDatabaseClient(event)).getModel<User>('users');

	return await userModel.find({}).sort('name');
});
