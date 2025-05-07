import {
  PermissionId,
} from './glue/permissions';
import type {
  Permission,
} from '#authorization-module';

export default defineNuxtConfig({
  ssr: false,

  imports: {
    autoImport: false,
  },

  modules: [
    '@antify/ui-module',
    '@antify/database-module',
    '../src/module',
  ],

  authorizationModule: {
    jwtSecret: '#a!SuperSecret123',
    databaseHandler: './server/datasources/db/databaseHandler',
    appHandlerFactoryPath: './appHandlerFactory',
    permissions: [
      {
        id: PermissionId.CAN_READ_SECRET_DATA,
        name: 'Can read secret data in playground',
      },
    ],
  },

  hooks: {
    'authorization-module:add-permissions': () => {
      return [
        {
          id: 'CAN_READ_ANOTHER_SECRET_DATA',
          name: 'Can read another secret data',
        },
      ] as Permission[];
    },
  },

  databaseModule: {
    configPath: './database.config.ts',
  },

  app: {
    pageTransition: {
      name: 'fade',
      mode: 'out-in',
    },
    layoutTransition: {
      name: 'fade',
      mode: 'out-in',
    },
  },

  devtools: {
    enabled: true,
  },
  compatibilityDate: '2024-07-29',
});
