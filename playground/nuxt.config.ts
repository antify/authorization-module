import {PermissionId} from './glue/permissions';

export default defineNuxtConfig({
	ssr: false,
	imports: {
		autoImport: false
	},
	modules: [
		'../src/module',
		'@antify/ui-module',
		'@antify/database-module'
	],
	authorizationModule: {
		jwtSecret: '#a!SuperSecret123',
		databaseHandler: './server/datasources/db/core/databaseHandler',
		mainProviderId: 'core',
		permissions: [
			{
				id: PermissionId.CAN_READ_SECRET_DATA,
				name: 'Can read secret data in playground'
			}
		],
		jailPageRoute: '/components/jail',
		providerJailPageRoute: '/components/jail'
	},
	devtools: {enabled: true}
});
