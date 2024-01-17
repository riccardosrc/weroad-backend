import { Migrator, TSMigrationGenerator } from '@mikro-orm/migrations';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { PostgreSqlDriver, Utils, defineConfig } from '@mikro-orm/postgresql';
import { getEnvVariables } from '../config/loader';

const { database } = getEnvVariables();

export default defineConfig({
  host: database.host,
  port: database.port,
  dbName: database.name,
  user: database.username,
  password: database.password,
  driver: PostgreSqlDriver,
  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],
  metadataProvider: TsMorphMetadataProvider,
  migrations: {
    tableName: 'mikro_orm_migrations',
    path: Utils.detectTsNode() ? 'src/migrations' : 'dist/migrations',
    glob: '!(*.d).{js,ts}',
    transactional: true,
    disableForeignKeys: false,
    generator: TSMigrationGenerator,
  },
  extensions: [Migrator],
});
