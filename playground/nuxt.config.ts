import {
  permissions,
} from '#shared';
import type {
  Permission,
} from '#authorization-module';
import {
  fileURLToPath,
} from 'node:url';

export default defineNuxtConfig({
  ssr: false,

  imports: {
    autoImport: false,
  },

  alias: {
    '#shared': fileURLToPath(new URL('./shared/permissions.ts', import.meta.url)),
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
