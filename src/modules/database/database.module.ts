import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { DatabaseProvider } from './database.provider';
import { MigrationsService } from './migrations.service';

@Module({
  providers: [DatabaseProvider, MigrationsService],
  exports: [DatabaseProvider],
  imports: [
    MikroOrmModule.forRootAsync({
      imports: [DatabaseModule],
      inject: [DatabaseProvider],
      useFactory: (databaseProvider: DatabaseProvider) =>
        databaseProvider.getConfigOptions(),
    }),
  ],
})
export class DatabaseModule {}
