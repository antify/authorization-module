import {defineAppHandlerFactory} from '#imports';

export default defineAppHandlerFactory((appId, tenantId) => ({
	// onUnauthorized: () => {
	// 	console.error('Unauthorized - Called from appHandlerFactory');
	// },
	// onBannedSystemWide: () => {
	// 	console.error('Banned system-wide - Called from appHandlerFactory');
	// },
	// onBannedInApp: () => {
	// 	console.error('Banned in app - Called from appHandlerFactory');
	// }
}));
