import {
  addImports,
  installModule,
  addImportsDir,
  createResolver,
  addTypeTemplate,
  defineNuxtModule,
  addComponentsDir,
  addServerHandler
} from '@nuxt/kit';
import {join, relative} from 'pathe';
import type {Permission} from './runtime/types';
import {PermissionId} from './runtime/permissions';
import {object, string, number, array, mixed} from 'yup';

export type ModuleOptions = {
  /**
   * Secret to hash the json web token
   */
  jwtSecret: string;

  /**
   * Expiration time in minutes for the json web token.
   * Default is 8 hours (480 minutes)
   */
  jwtExpiration?: number;

  /**
   * Integration between the module and the project's user logic.
   * Must return a defineDatabaseHandler();
   *
   * If not database handler is given, the components BanAuthorizationButton and BanAppAccessButton
   * will not work and therefore not provided.
   */
  databaseHandler?: string | null;

  /**
   * The name of the cookie to store the jwt.
   * Default is antt
   */
  tokenCookieName?: string;

  /**
   * The name of the cookie to store the tenantId.
   * Only mandatory on multi-tenancy systems.
   * Default is antten
   */
  tenantIdCookieName?: string;

  /**
   * List of permissions, that are available in the system.
   * This list can get extended by other modules.
   *
   * It is required to show it in role CRUD.
   */
  permissions?: Permission[];

  /**
   * Client side factory to create app handlers for different app contexts.
   * With an app handler, you can manage what should happen if a user has no permissions or is unauthorized.
   *
   * Must return a defineAppHandlerFactory() function.
   */
  appHandlerFactoryPath: string;
};

const optionsValidator = object().shape({
  jwtSecret: string().required('JWT secret is required'),
  jwtExpiration: number().min(1, 'JWT expiration must be greater than 1 minute').default(480),
  databaseHandler: string().nullable().default(null),
  tokenCookieName: string().required('Token cookie name is required').default('antt'),
  tenantIdCookieName: string().required('TenantId cookie name is required').default('antten'),
  permissions: array().of(
    object().shape({
      id: string().required(),
      name: string().required(),
    })
  ).default([]),
  appHandlerFactoryPath: string().required('App handler factory path is required')
});

// https://github.com/nuxt/content/blob/main/src/module.ts
// export interface ModuleHooks {
// 	'authorizationModule:register-permissions'(): void
// }

export * from './runtime/types';

// TODO:: on delete tenant, delete roles
// TODO:: Write all permissions into a typed file. They are collected on build time once.
//  It would improve code because unused or wrong permissions are detected on build time.
export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'authorization-module',
    configKey: 'authorizationModule',
    // compatibility: {
    // 	nuxt: '3.10.0'
    // }
  },
  async setup(options, nuxt) {
    if (JSON.stringify(options) === '{}') {
      // nuxt-module-build build --stub call this setup without any options. This would break the code.
      return;
    }

    try {
      await optionsValidator.validate(options);
    } catch (e) {
      throw new Error(`Invalid options for authorization-module:\n${e.message}`);
    }

    const _options = await optionsValidator.cast(options, {stripUnknown: true});

    await installModule('@pinia/nuxt');

    const {resolve} = createResolver(import.meta.url);
    const runtimeDir = resolve('runtime');
    const typesBuildDir = join(nuxt.options.buildDir, 'types');

    nuxt.options.build.transpile.push(runtimeDir);
    nuxt.options.alias['#authorization-module'] = resolve(runtimeDir, 'server');

    nuxt.options.runtimeConfig.authorizationModule = {
      ..._options,
      permissions: [..._options.permissions, ...[
        {
          id: PermissionId.CAN_BAN_AUTHORIZATION,
          name: 'Can ban authorization'
        },
        {
          id: PermissionId.CAN_UNBAN_AUTHORIZATION,
          name: 'Can unban authorization'
        },
        {
          id: PermissionId.CAN_UPDATE_ROLE,
          name: 'Can update role'
        },
        {
          id: PermissionId.CAN_DELETE_ROLE,
          name: 'Can delete role'
        },
        {
          id: PermissionId.CAN_CREATE_ROLE,
          name: 'Can create role'
        },
        {
          id: PermissionId.CAN_READ_ROLE,
          name: 'Can read role'
        }
      ]]
    };

    nuxt.options.runtimeConfig.public.authorizationModule = {
      tokenCookieName: _options.tokenCookieName,
      tenantIdCookieName: _options.tenantIdCookieName
    };

    nuxt.hook('modules:done', async () => {
      // TODO:: type hook
      // @ts-ignore
    	const permissions = await nuxt.callHook('authorization-module:add-permissions') as Permission[] || [];

      //@ts-ignore
    	nuxt.options.runtimeConfig.authorizationModule.permissions = [
        // @ts-ignore
    		...nuxt.options.runtimeConfig.authorizationModule.permissions,
    		...permissions
    	];
    });

    const databaseHandlerPath = _options.databaseHandler ? resolve(nuxt.options.rootDir, _options.databaseHandler) : null;

    nuxt.hook('nitro:config', (nitroConfig) => {
      nitroConfig.alias = nitroConfig.alias || {};

      nitroConfig.alias['#authorization-module'] = resolve(runtimeDir, 'server');

      if (databaseHandlerPath) {
        nitroConfig.alias['#authorization-module-database-handler'] = databaseHandlerPath;
      }
    });

    // TODO:: Check templates - maybe they are not needed
    const databaseHandlerTemplate = addTypeTemplate({
      filename: 'types/authorization-module-database-handler.d.ts',
      getContents: () => [
        "declare module '#authorization-module-database-handler' {",
        `  const default: typeof import("${relative(typesBuildDir, databaseHandlerPath || '')}")['default']`,
        '}',
        'export {}'
      ].join('\n')
    });

    const template = addTypeTemplate({
      filename: 'types/authorization-module.d.ts',
      getContents: () => [
        'declare module \'#authorization-module\' {',
        `  const defineDatabaseHandler: typeof import('${relative(typesBuildDir, join(runtimeDir, 'server', 'database-handler'))}')['defineDatabaseHandler']`,
        `  const isLoggedInHandler: typeof import('${relative(typesBuildDir, join(runtimeDir, 'server', 'handlers'))}')['isLoggedInHandler']`,
        `  const isAuthorizedHandler: typeof import('${relative(typesBuildDir, join(runtimeDir, 'server', 'handlers'))}')['isAuthorizedHandler']`,
        `  const useEventReader: typeof import('${relative(typesBuildDir, join(runtimeDir, 'server', 'utils'))}')['useEventReader']`,
        `  export * from '${relative(typesBuildDir, join(runtimeDir, 'types'))}'`,
        '}',
        // "declare module '@nuxt/schema' {",
        // "	export interface RuntimeNuxtHooks {",
        // "		'authorizationModule:register-permissions': () => void | Promise<void>",
        // "	}",
        // "}",
        'export {}'
      ].join('\n'),
    });

    nuxt.hook('prepare:types', (options) => {
      if (databaseHandlerPath) {
        options.references.push({path: databaseHandlerTemplate.dst});
      }

      options.references.push({path: template.dst});
    });

    await addComponentsDir({
      path: resolve(runtimeDir, 'components'),
      pathPrefix: false,
      prefix: 'AuthorizationModule',
      global: true
    });

    if (_options.databaseHandler) {
      await addComponentsDir({
        path: resolve(runtimeDir, 'maybe-components'),
        pathPrefix: false,
        prefix: 'AuthorizationModule',
        global: true
      });

      // TODO:: Test why this make problems on using this module in an other module
      addServerHandler({
        route: '/api/authorization-module/maybe-components/ban-authorization-button/change-ban-status',
        method: 'post',
        handler: resolve(runtimeDir, 'server', 'api', 'maybe-components', 'ban-authorization-button', 'change-ban-status.post')
      });

      addServerHandler({
        route: '/api/authorization-module/stores/role-input',
        method: 'get',
        handler: resolve(runtimeDir, 'server', 'api', 'stores', 'role-input', 'index.get')
      });

      // Role crud api endpoints
      addServerHandler({
        route: '/api/authorization-module/components/role-crud/role-table',
        method: 'get',
        handler: resolve(runtimeDir, 'server', 'api', 'components', 'role-crud', 'role-table', 'index.get')
      });

      addServerHandler({
        route: '/api/authorization-module/stores/role-crud/:roleId',
        method: 'get',
        handler: resolve(runtimeDir, 'server', 'api', 'stores', 'role-crud', '[roleId].get')
      });

      addServerHandler({
        route: '/api/authorization-module/stores/role-crud',
        method: 'post',
        handler: resolve(runtimeDir, 'server', 'api', 'stores', 'role-crud', 'index.post')
      });

      addServerHandler({
        route: '/api/authorization-module/stores/role-crud/:roleId',
        method: 'delete',
        handler: resolve(runtimeDir, 'server', 'api', 'stores', 'role-crud', '[roleId].delete')
      });
    }

    addImportsDir(resolve(runtimeDir, 'composables'));
    addImports({
      name: 'default',
      as: 'appHandlerFactory',
      from: resolve(nuxt.options.rootDir, _options.appHandlerFactoryPath)
    });

    // TODO:: only register in dev mode!
    addServerHandler({
      route: '/api/authorization-module/dev/jwt-form/create-jwt',
      method: 'post',
      handler: resolve(runtimeDir, 'server', 'api', 'dev', 'jwt-form', 'create-jwt.post')
    });

    // TODO:: only register in dev mode!
    addServerHandler({
      route: '/api/authorization-module/dev/jwt-form/app-data',
      method: 'get',
      handler: resolve(runtimeDir, 'server', 'api', 'dev', 'jwt-form', 'app-data.get')
    });
  }
});
