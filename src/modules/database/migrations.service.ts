import { MikroORM } from '@mikro-orm/core';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class MigrationsService {
  private logger: Logger;

  constructor(private orm: MikroORM) {
    this.logger = new Logger(MigrationsService.name);
    this.runMigrations();
  }

  private async runMigrations() {
    this.logger.log('migrations sync running');
    const { migrator } = this.orm;
    // check if there are some pending migrations to run
    try {
      const pendingMigrations = await migrator.getPendingMigrations();
      this.logger.log(`pending migrations ${pendingMigrations.length}`);

      // if there is at least one pending migration run them to sync the database
      if (pendingMigrations.length > 0) {
        this.logger.log('running pending migrations');
        await migrator.up();
      }
      this.logger.log('migrations sync completed');
    } catch (error) {
      this.logger.error('migrations sync error', error);
    }
  }
}
