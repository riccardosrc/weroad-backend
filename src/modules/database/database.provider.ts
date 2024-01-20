import { MikroOrmModuleOptions } from '@mikro-orm/nestjs';
import { PostgreSqlDriver, Utils } from '@mikro-orm/postgresql';
import { Migrator, TSMigrationGenerator } from '@mikro-orm/migrations';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DatabaseProvider {
  constructor(private configService: ConfigService) {}

  getConfigOptions(): MikroOrmModuleOptions {
    return {
      host: this.configService.get('database.host'),
      port: this.configService.get('database.port'),
      dbName: this.configService.get('database.name'),
      user: this.configService.get('database.username'),
      password: this.configService.get('database.password'),
      autoLoadEntities: true,
      driver: PostgreSqlDriver,
      extensions: [Migrator],
      debug: false,
      migrations: {
        tableName: 'mikro_orm_migrations',
        path: Utils.detectTsNode() ? 'src/migrations' : 'dist/migrations',
        glob: '!(*.d).{js,ts}',
        transactional: true,
        disableForeignKeys: false,
        generator: TSMigrationGenerator,
      },
    };
  }
}
