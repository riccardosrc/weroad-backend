import { Module } from '@nestjs/common';
import { DatabaseModule } from './modules/database/database.module';
import { ConfigModule } from './modules/config/config.module';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
