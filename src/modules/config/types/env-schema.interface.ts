import { EnvTarget } from './env-target.enum';

export interface EnvSchema {
  target: EnvTarget;
  app: {
    port: number;
  };
  database: {
    host: string;
    port: number;
    username: string;
    password: string;
    name: string;
  };
}
