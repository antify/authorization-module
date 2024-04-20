import {defineEventHandler, useRuntimeConfig} from '#imports';

export default defineEventHandler(async () => {
	// TODO:: On dev mode only!!
	return useRuntimeConfig().authorizationModule.permissions;
});
