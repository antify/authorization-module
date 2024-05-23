import {defineEventHandler, useRuntimeConfig} from '#imports';

export default defineEventHandler(async () => {
	const {permissions} = useRuntimeConfig().authorizationModule;
	const {apps} = useRuntimeConfig().appContextModule;

	// TODO:: On dev mode only!!
	return {
		apps,
		permissions
	};
});
