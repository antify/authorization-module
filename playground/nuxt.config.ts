import {
  permissions,
} from './shared/permissions';
import type {
  Permission,
} from '#authorization-module';

export default defineNuxtConfig({
  ssr: false,

  imports: {
    autoImport: false,
  },

  modules: [
    '@antify/template-module',
    '@antify/database-module',
    '../src/module',
  ],

  authorizationModule: {
    jwtSecret: '#a!SuperSecret123',
    databaseHandler: './server/datasources/db/databaseHandler',
    appHandlerFactoryPath: './appHandlerFactory',
    permissions: permissions,
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
