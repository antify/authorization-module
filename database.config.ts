import {
  defineDatabaseConfig,
} from '@antify/database';
import {
  TEST_TENANT_ID,
  SECOND_TEST_TENANT_ID,
} from './playground/server/datasources/db/fixture-utils/tenant';

export default defineDatabaseConfig({
  app: {
    databaseUrl: 'mongodb://root:root@localhost:27017',
    isSingleConnection: false,
    migrationDir: 'src/runtime/server/datasources/db/migrations',
    fixturesDir: [
      'playground/server/datasources/db/fixtures',
    ],
    schemasDir: [
      'src/runtime/server/datasources/schemas',
      'playground/server/datasources/db/schemas',
    ],
    fetchTenants: () => {
      return new Promise((resolve) => {
        resolve([
          {
            id: TEST_TENANT_ID,
            name: 'Test tenant',
          },
          {
            id: SECOND_TEST_TENANT_ID,
            name: 'Second tenant',
          },
        ]);
      });
    },
  },
});
