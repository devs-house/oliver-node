import { KeyPair, OliverClient } from '../src/client';
import * as apiClient from '../src/apiClient';
import { Environment } from '../src/config';

jest.spyOn(apiClient, 'apiClient').mockReturnValue({ request: jest.fn() });

describe('client', () => {
  it('init should create development client', () => {
    // Given
    const env: Environment = 'development';
    const keys: KeyPair = { apiKey: 'key', apiSecret: 'secret' };

    // When
    const oliver = new OliverClient(env, keys);

    // Then
    expect(oliver.config.environment).toEqual(env);
    expect(oliver.config.apiUrl).toEqual('https://development.olvr.app/api');
    expect(oliver.userKeys).toEqual(keys);
  });

  it('init should create staging client', () => {
    // Given
    const env: Environment = 'staging';
    const keys: KeyPair = { apiKey: 'key', apiSecret: 'secret' };

    // When
    const oliver = new OliverClient(env, keys);

    // Then
    expect(oliver.config.environment).toEqual(env);
    expect(oliver.config.apiUrl).toEqual('https://staging.olvr.app/api');
    expect(oliver.userKeys).toEqual(keys);
  });

  it('init should create production client', () => {
    // Given
    const env: Environment = 'production';
    const keys: KeyPair = { apiKey: 'key', apiSecret: 'secret' };

    // When
    const oliver = new OliverClient(env, keys);

    // Then
    expect(oliver.config.environment).toEqual(env);
    expect(oliver.config.apiUrl).toEqual('https://olvr.app/api');
    expect(oliver.userKeys).toEqual(keys);
  });

  it('user should call apiClient', () => {
    // Given
    const env: Environment = 'production';
    const keys: KeyPair = { apiKey: 'key', apiSecret: 'secret' };
    const oliver = new OliverClient(env, keys);

    // When
    oliver.user();

    // Then
    expect(apiClient.apiClient).toBeCalled();
  });

  it('room should call apiClient with roomKeys', () => {
    // Given
    const env: Environment = 'production';
    const keys: KeyPair = { apiKey: 'key', apiSecret: 'secret' };
    const roomKeys: KeyPair = { apiKey: 'roomKey', apiSecret: 'roomSecret' };
    const oliver = new OliverClient(env, keys);

    // When
    oliver.room(roomKeys);

    // Then
    expect(apiClient.apiClient).toBeCalled();
  });
});
