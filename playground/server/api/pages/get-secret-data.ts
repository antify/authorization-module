import type {H3Event} from 'h3';
import {isAuthorizedHandler, isLoggedInHandler} from '#authorization-module/handlers';
import {PermissionId} from '~/glue/permissions';
import {getContext} from '#database-module';
import {defineEventHandler} from '#imports';

export default defineEventHandler(async (event: H3Event) => {
	const {provider, tenantId} = getContext(event);

	await isLoggedInHandler(event);
	await isAuthorizedHandler(event, PermissionId.CAN_READ_SECRET_DATA, provider, tenantId);

	return {
		default: 'Secret data!',
	};
});
