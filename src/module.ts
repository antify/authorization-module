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
import {PermissionId} from './runtime/glue/permissions';
import {isTypeOfRule, notBlankRule, Types, useValidator} from '@antify/validate';

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
   * AppId where the Authorizations are stored.
   */
  mainAppId: string;

  /**
   * The name of the cookie to store the jwt.
   * Default is antt
   */
  tokenCookieName?: string;

  /**
   * List of permissions, that are available in the system.
   * This list can get extended by other modules.
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

type ValidatedModuleOptions = Required<ModuleOptions>

const optionsValidator = useValidator<ValidatedModuleOptions>({
  jwtSecret: {
    rules: [notBlankRule]
  },
  jwtExpiration: {
    // TODO:: Make sure its bigger than 1 minute?
    rules: [
      (val) => isTypeOfRule(val, Types.NUMBER)
    ],
    defaultValue: 480
  },

  databaseHandler: {
    rules: [
      (val) => isTypeOfRule(val, [Types.STRING, Types.NULL]),
      (val) => isTypeOfRule(val, Types.STRING) === true ? notBlankRule(val) : true
    ],
    defaultValue: null
  },

  mainAppId: {
    rules: [notBlankRule]
  },

  tokenCookieName: {
    rules: [notBlankRule],
    defaultValue: 'antt'
  },

  // TODO:: Make sure, the permissions group is in appApps
  // TODO:: Test if https://github.com/antify/validate/issues/7 is implemented
  permissions: {
    rules: [
      (val) => isTypeOfRule(val, Types.ARRAY),
      (val, formData) => {
        if (!isTypeOfRule(val, Types.ARRAY) || !isTypeOfRule(formData.appApps, Types.ARRAY)) {
          return true;
        }

        for (const permission of val) {
          for (const appId of permission.appIds || []) {
            if (!(formData.appApps || []).includes(appId)) {
              return `Permission ${permission.id} has an invalid appId ${appId} in appIds`;
            }
          }
        }

        return true;
      }
    ],
    defaultValue: [],
  },

  appHandlerFactoryPath: {
    rules: [notBlankRule]
  }
});

// https://github.com/nuxt/content/blob/main/src/module.ts
// export interface ModuleHooks {
// 	'authorizationModule:register-permissions'(): void
// }

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
    await installModule('@antify/app-context-module', nuxt.options.runtimeConfig.appContextModule);

    if (JSON.stringify(options) === '{}') {
      // nuxt-module-build build --stub call this setup without any options. This would break the code.
      return;
    }

    const _options = optionsValidator.validate(options);

    if (optionsValidator.hasErrors()) {
      throw new Error(`Invalid options for authorization-module:\n${optionsValidator.getErrorsAsString()}`);
    }

    await installModule('@pinia/nuxt');

    const {resolve} = createResolver(import.meta.url);
    const runtimeDir = resolve('runtime');
    const typesBuildDir = join(nuxt.options.buildDir, 'types');

    nuxt.options.build.transpile.push(runtimeDir);
    nuxt.options.alias['#authorization-module'] = runtimeDir;

    const permissions: Permission[] = [
      {
        id: PermissionId.CAN_BAN_AUTHORIZATION,
        name: 'Can ban user system-wide',
        appIds: [_options.mainAppId]
      },
      {
        id: PermissionId.CAN_UNBAN_AUTHORIZATION,
        name: 'Can unban user system-wide',
        appIds: [_options.mainAppId]
      },
      {
        id: PermissionId.CAN_BAN_APP_ACCESS,
        name: 'Can ban user'
      },
      {
        id: PermissionId.CAN_UNBAN_APP_ACCESS,
        name: 'Can unban user'
      },
      {
        id: PermissionId.CAN_BAN_ADMIN_APP_ACCESS,
        name: 'Can ban admin user'
      },
      {
        id: PermissionId.CAN_UNBAN_ADMIN_APP_ACCESS,
        name: 'Can unban admin user'
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
    ];

    nuxt.options.runtimeConfig.authorizationModule = {
      ..._options,
      permissions: [..._options.permissions, ...permissions]
    };

    nuxt.options.runtimeConfig.public.authorizationModule = {
      tokenCookieName: _options.tokenCookieName,
      mainAppId: _options.mainAppId
    };

    // nuxt.hook('modules:done', async () => {
    // 	// TODO:: type hook
    // 	// @ts-ignore
    // 	const permissions = await nuxt.callHook('authorization-module:add-permissions') as Permission[] || [];
    //
    // 	// @ts-ignore
    // 	nuxt.options.runtimeConfig.authorizationModule.permissions = [
    // 		// @ts-ignore
    // 		...nuxt.options.runtimeConfig.authorizationModule.permissions,
    // 		...permissions
    // 	];
    // });

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

      addServerHandler({
        route: '/api/authorization-module/stores/role/roles',
        method: 'get',
        handler: resolve(runtimeDir, 'server', 'api', 'stores', 'role', 'roles.get')
      });
    }

    addImportsDir(resolve(runtimeDir, 'composables'));
    addImports({
      name: 'default',
      as: 'appHandlerFactory',
      from: resolve(nuxt.options.rootDir, _options.appHandlerFactoryPath)
    });

    // TODO:: Test why this make problems on using this module in an other module
    if (_options.databaseHandler) {
      addServerHandler({
        route: '/api/authorization-module/components/ban-authorization-button/change-ban-status',
        method: 'post',
        handler: resolve(runtimeDir, 'server', 'api', 'components', 'ban-authorization-button', 'change-ban-status.post')
      });

      addServerHandler({
        route: '/api/authorization-module/components/ban-app-access-button/change-ban-status',
        method: 'post',
        handler: resolve(runtimeDir, 'server', 'api', 'components', 'ban-app-access-button', 'change-ban-status.post')
      });
    }

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
