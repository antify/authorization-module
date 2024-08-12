import {PermissionId} from './glue/permissions';
import type {Permission} from '#authorization-module/types';

export default defineNuxtConfig({
  ssr: false,

  imports: {
    autoImport: false
  },

  modules: [
    '@antify/ui-module',
    '../src/module',
    '@antify/app-context-module',
    '@nuxt/test-utils/module'
  ],

  authorizationModule: {
    jwtSecret: '#a!SuperSecret123',
    databaseHandler: './server/datasources/db/core/databaseHandler',
    appHandlerFactoryPath: './appHandlerFactory',
    mainAppId: 'core',
    permissions: [
      {
        id: PermissionId.CAN_READ_SECRET_DATA,
        name: 'Can read secret data in playground'
      }
    ],
  },

  appContextModule: {
    apps: [
      {
        id: 'core'
      },
      {
        id: 'tenant',
        isMultiTenant: true
      }
    ],
  },

  hooks: {
    'authorization-module:add-permissions': () => {
      return [{
        id: 'CAN_READ_COCKPIT_SECRET_DATA',
        name: 'Can read secret data in cockpit app',
        appIds: ['core'],
      }] as Permission[];
    }
  },

  devtools: {enabled: true},
  compatibilityDate: '2024-07-29'
});
