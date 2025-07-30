import 'dotenv/config';
import { defineConfig } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { Migrator } from '@mikro-orm/migrations';
import { TSMigrationGenerator } from '@mikro-orm/migrations';

const PRODUCTION = 'production';

export default defineConfig({
  driver: PostgreSqlDriver,
  dbName: process.env.DB_NAME!,
  host: process.env.DB_HOST!,
  port: parseInt(process.env.DB_PORT!, 10),
  user: process.env.DB_USERNAME!,
  password: process.env.DB_PASSWORD!,
  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],
  ensureDatabase: process.env.NODE_ENV !== PRODUCTION,
  pool: {
    min: parseInt(process.env.DB_POOL_MIN!, 10),
    max: parseInt(process.env.DB_POOL_MAX!, 10),
  },
  forceUtcTimezone: true,
  validate: true,
  strict: true,
  debug: process.env.DB_LOGGING === 'true',
  extensions: [Migrator],
  migrations: {
    tableName: process.env.DM_MIGRATION_TABLE_NAME,
    path: 'dist/migrations',
    pathTs: 'src/migrations',
    glob: '!(*.d).{js,ts}',
    transactional: true,
    disableForeignKeys: true,
    allOrNothing: true,
    dropTables: true,
    safe: false,
    snapshot: true,
    emit: 'ts',
    generator: TSMigrationGenerator,
  },
});
