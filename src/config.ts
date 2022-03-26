export type Environment = 'local' | 'development' | 'staging' | 'production';

export type Config = {
  environment: Environment;
  apiUrl: string;
};

const local: Config = {
  environment: 'local',
  apiUrl: 'http://localhost:5001/oliver-development-585f8/us-central1/api/api',
};

const development: Config = {
  environment: 'development',
  apiUrl: 'https://development.olvr.app/api',
};

const staging: Config = {
  environment: 'staging',
  apiUrl: 'https://staging.olvr.app/api',
};

const production: Config = {
  environment: 'production',
  apiUrl: 'https://olvr.app/api',
};

export const config: Record<Environment, Config> = {
  local,
  development,
  staging,
  production,
};
