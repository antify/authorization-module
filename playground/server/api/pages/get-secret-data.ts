import type {H3Event} from 'h3';
import {isAuthorizedHandler, isLoggedInHandler} from '#authorization-module';
import {PermissionId} from '~/glue/permissions';
import {defineEventHandler} from '#imports';

export default defineEventHandler(async (event: H3Event) => {
	await isLoggedInHandler(event);
	await isAuthorizedHandler(event, PermissionId.CAN_READ_SECRET_DATA);

	return {
		default: 'Secret data!',
	};
});
