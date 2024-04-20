import {
	defineNuxtModule,
	addComponentsDir,
	addServerHandler,
	addTypeTemplate,
	createResolver,
	addImportsDir,
	installModule
} from '@nuxt/kit'
import {join, relative} from 'pathe';
import type {Permission} from './runtime/types';
import {permissions} from './runtime/glue/permissions';
// import type {RouteLocationRaw} from 'vue-router';

export type ModuleOptions = {
	/**
	 * Secret to hash the json web token
	 */
	jwtSecret: string;

	/**
	 * Expiration time in minutes for the json web token.
	 * Default is 8 hours (480 minutes)
	 */
	jwtExpiration: number;

	/**
	 * Integration between the module and the project's user logic.
	 * Must return a defineDatabaseHandler();
	 */
	databaseHandler: string;

	/**
	 * The id of the provider, where all roles and authorizations are stored.
	 */
	mainProviderId: string;

	/**
	 * The name of the cookie to store the jwt token.
	 * Default is antt
	 */
	tokenCookieName: string;

	/**
	 * List of permissions, that are available in the system.
	 * This list can get extended by other modules.
	 */
	permissions: Permission[];

	/**
	 * Route to redirect to, if the user is not logged in.
	 * If not set, the user will be redirected to the default nuxt error page.
	 */
	loginPageRoute?: string // RouteLocationRaw;

	/**
	 * Route to redirect to, if the user is system-wide banned.
	 * If not set, the user will be redirected to the default nuxt error page.
	 */
	jailPageRoute?: string // RouteLocationRaw;

	/**
	 * Route to redirect to, if the user is banned in provider context.
	 * If not set, the user will be redirected to the default nuxt error page.
	 */
	providerJailPageRoute?: string // RouteLocationRaw;
};

// https://github.com/nuxt/content/blob/main/src/module.ts
// export interface ModuleHooks {
// 	'authorizationModule:register-permissions'(): void
// }

// TODO:: on delete tenant, delete user provider accesses and roles
export default defineNuxtModule<ModuleOptions>({
	meta: {
		name: 'authorization-module',
		configKey: 'authorizationModule'
	},
	async setup(options, nuxt) {
		// TODO:: make sure, the @antify/database-module is installed
		// await installModule('@antify/database-module')

		const {resolve} = createResolver(import.meta.url);
		const runtimeDir = resolve('runtime');
		const typesBuildDir = join(nuxt.options.buildDir, 'types');

		nuxt.options.build.transpile.push(runtimeDir);
		nuxt.options.alias['#authorization-module'] = resolve(runtimeDir, 'types');

		// TODO:: validate options
		// TODO:: validate, that the main provider id is in the providers
		// TODO:: validate, provider.id is unique
		// TODO:: validate if mainProviderId really exists
		const tokenCookieName = options.tokenCookieName || 'antt'
		options.tokenCookieName = tokenCookieName;
		options.jwtExpiration = options.jwtExpiration || 480;
		options.permissions = options.permissions || [];
		options.permissions = [...options.permissions, ...permissions];
		nuxt.options.runtimeConfig.authorizationModule = options;

		// Public runtime config
		nuxt.options.runtimeConfig.public.authorizationModule = {
			// @ts-ignore todo:: fix ts error
			loginPageRoute: options.loginPageRoute,
			// @ts-ignore todo:: fix ts error
			jailPageRoute: options.jailPageRoute,
			// @ts-ignore todo:: fix ts error
			providerJailPageRoute: options.providerJailPageRoute,
			tokenCookieName,
			mainProviderId: options.mainProviderId,
		}

		const databaseHandlerPath = resolve(nuxt.options.rootDir, options.databaseHandler);

		nuxt.hook('nitro:config', (nitroConfig) => {
			nitroConfig.alias = nitroConfig.alias || {}

			nitroConfig.alias['#authorization-module-database-handler'] = databaseHandlerPath
			nitroConfig.alias['#authorization-module'] = resolve(runtimeDir, 'server')
		})

		const authorizationModuleDatabaseHandlerTemplate = addTypeTemplate({
			filename: 'types/authorization-module-database-handler.d.ts',
			getContents: () => [
				"declare module '#authorization-module-database-handler' {",
				`  const default: typeof import("${relative(typesBuildDir, databaseHandlerPath)}")['default']`,
				'}',
				'export {}'
			].join('\n')
		})

		const template = addTypeTemplate({
			filename: 'types/authorization-module.d.ts',
			getContents: () => [
				'declare module \'#authorization-module\' {',
				`  const defineDatabaseHandler: typeof import('${relative(typesBuildDir, join(runtimeDir, 'server', 'database-handler'))}')['defineDatabaseHandler']`,
				`  const isLoggedInHandler: typeof import('${relative(typesBuildDir, join(runtimeDir, 'server', 'handlers'))}')['isLoggedInHandler']`,
				`  const isAuthorizedHandler: typeof import('${relative(typesBuildDir, join(runtimeDir, 'server', 'handlers'))}')['isAuthorizedHandler']`,
				`  export * from '${relative(typesBuildDir, join(runtimeDir, 'types'))}'`,
				'}',
				// "declare module '@nuxt/schema' {",
				// "	export interface RuntimeNuxtHooks {",
				// "		'authorizationModule:register-permissions': () => void | Promise<void>",
				// "	}",
				// "}",
				'export {}'
			].join('\n'),
		})

		nuxt.hook('prepare:types', (options) => {
			options.references.push({path: authorizationModuleDatabaseHandlerTemplate.dst})
			options.references.push({path: template.dst})
		})

		await addComponentsDir({
			path: resolve(runtimeDir, 'components'),
			pathPrefix: false,
			prefix: 'AntAuth',
			global: true
		})

		await installModule('@pinia/nuxt');

		addImportsDir(resolve(runtimeDir, 'composables'));

		// nuxt.hook('mailerModule:registerTemplates', () => mailTemplates)

		// TODO:: May write it into a file in dist dir with types, cuz it does not change after build
		// nuxt.hook('modules:done', async () => {
		// 	// TODO:: type hook
		// 	const permissions = await nuxt.callHook('authorizationModule:register-permissions') || [];
		//
		// 	nuxt.options.runtimeConfig.authorizationModule.permissions = permissions;
		// });

		addServerHandler({
			route: '/api/authorization-module/stores/role/roles',
			method: 'get',
			handler: resolve(runtimeDir, 'server/api/stores/role/roles.get')
		});

		addServerHandler({
			route: '/api/authorization-module/components/ban-authorization-button/change-ban-status',
			method: 'post',
			handler: resolve(runtimeDir, 'server/api/components/ban-authorization-button/change-ban-status.post')
		});

		addServerHandler({
			route: '/api/authorization-module/components/ban-provider-access-button/change-ban-status',
			method: 'post',
			handler: resolve(runtimeDir, 'server/api/components/ban-provider-access-button/change-ban-status.post')
		});

		// TODO:: only register in dev mode!
		addServerHandler({
			route: '/api/authorization-module/dev/jwt-form/create-jwt',
			method: 'post',
			handler: resolve(runtimeDir, 'server/api/dev/jwt-form/create-jwt.post')
		});

		// TODO:: only register in dev mode!
		addServerHandler({
			route: '/api/authorization-module/dev/jwt-form/all-permissions',
			method: 'get',
			handler: resolve(runtimeDir, 'server/api/dev/jwt-form/all-permissions.get')
		});
	}
})
