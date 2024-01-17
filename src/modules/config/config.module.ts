import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { getEnvVariables } from './loader';

@Module({
  imports: [
    NestConfigModule.forRoot({ isGlobal: true, load: [getEnvVariables] }),
  ],
})
export class ConfigModule {}
