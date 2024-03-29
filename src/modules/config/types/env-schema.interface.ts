import { EnvTarget } from './env-target.enum';

/**
 * loaded envirnment schema
 */
export interface EnvSchema {
  target: EnvTarget;
  app: {
    port: number;
    jwtSecret: string;
    defaultAdminEmail: string;
    defaultAdminPassword: string;
  };
  database: {
    host: string;
    port: number;
    username: string;
    password: string;
    name: string;
  };
}
