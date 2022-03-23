export type Environment = 'development' | 'staging' | 'production';

export type Config = {
  environment: Environment;
  apiUrl: string;
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
  development: development,
  staging: staging,
  production: production,
};
