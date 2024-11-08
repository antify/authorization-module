import {defineDatabaseConfig} from '@antify/database';

export default defineDatabaseConfig({
  core: {
    databaseUrl: 'mongodb://core:core@localhost:27017/core',
    isSingleConnection: true,
    migrationDir: 'src/runtime/server/datasources/db/migrations',
    fixturesDir: [
      'src/cli/fixtures',
      'playground/server/datasources/db/core/fixtures',
    ],
    schemasDir: [
      'src/runtime/server/datasources/schemas',
      'playground/server/datasources/db/core/schemas',
    ]
  }
});
