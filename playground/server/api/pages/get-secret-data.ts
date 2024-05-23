import type {H3Event} from 'h3';
import {isAuthorizedHandler, isLoggedInHandler} from '#authorization-module';
import {PermissionId} from '~/glue/permissions';
import {useAppContext} from '#app-context-module';
import {defineEventHandler} from '#imports';

export default defineEventHandler(async (event: H3Event) => {
	const {appId, tenantId} = useAppContext().handleRequest(event);

	await isLoggedInHandler(event);
	await isAuthorizedHandler(event, PermissionId.CAN_READ_SECRET_DATA, appId, tenantId);

	return {
		default: 'Secret data!',
	};
});
