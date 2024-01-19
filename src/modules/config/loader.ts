import * as path from 'path';
import { existsSync } from 'fs';
import { configDotenv } from 'dotenv';

import { EnvTarget } from './types/env-target.enum';
import { EnvSchema } from './types/env-schema.interface';

// set .env file path
const envFilePath = path.resolve('.env');
const envExists = existsSync(envFilePath);

// check if the file exists
if (!envExists) {
  throw new Error('Missing .env file');
}

// parse env variables
const { error, parsed } = configDotenv({ path: envFilePath });

if (error) {
  throw new Error('Error while parsing env file');
}

// construct env schema
const env: EnvSchema = {
  target: EnvTarget[parsed?.ENV_TARGET],
  app: {
    port: +parsed?.APP_PORT,
    jwtSecret: parsed?.APP_JWT_SECRET,
    defaultAdminEmail: parsed?.APP_DEFAULT_ADMIN_EMAIL,
    defaultAdminPassword: parsed?.APP_DEFAULT_ADMIN_PASSWORD,
  },
  database: {
    host: parsed?.DATABASE_HOST,
    port: +parsed?.DATABASE_PORT,
    username: parsed?.DATABASE_USERNAME,
    password: parsed?.DATABASE_PASSWORD,
    name: parsed?.DATABASE_NAME,
  },
};

export const getEnvVariables = (): EnvSchema => ({
  ...env,
});
