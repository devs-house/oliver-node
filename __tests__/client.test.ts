import { oliver } from '../src/index';
import { Environment } from '../src/config';
import { KeyPair } from '../src/types';

describe('client', () => {
  it('init should create development client', () => {
    // Given
    const env: Environment = 'development';
    const keys: KeyPair = { apiKey: 'key', apiSecret: 'secret' };

    // When
    oliver.configure(env, keys);

    // Then
    expect(oliver.config.environment).toEqual(env);
    expect(oliver.config.apiUrl).toEqual('https://development.olvr.app/api');
    expect(oliver.userKey).toEqual(keys);
  });

  it('init should create staging client', () => {
    // Given
    const env: Environment = 'staging';
    const keys: KeyPair = { apiKey: 'key', apiSecret: 'secret' };

    // When
    oliver.configure(env, keys);

    // Then
    expect(oliver.config.environment).toEqual(env);
    expect(oliver.config.apiUrl).toEqual('https://staging.olvr.app/api');
    expect(oliver.userKey).toEqual(keys);
  });

  it('init should create production client', () => {
    // Given
    const env: Environment = 'production';
    const keys: KeyPair = { apiKey: 'key', apiSecret: 'secret' };

    // When
    oliver.configure(env, keys);

    // Then
    expect(oliver.config.environment).toEqual(env);
    expect(oliver.config.apiUrl).toEqual('https://olvr.app/api');
    expect(oliver.userKey).toEqual(keys);
  });
});
