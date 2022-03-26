import { ApiClient, ErrorType } from './apiClient';
import { config, Config, Environment } from './config';
import { OLError } from './entities/Error';
import { KeyPair } from './types';

class Oliver {
  // MARK: - Properties

  private _config: Config;
  private _apiClient: ApiClient;
  private static _instance: Oliver;

  // MARK: - Getters

  public static get instance() {
    return this._instance || (this._instance = new this());
  }

  public get apiClient() {
    if (!this._apiClient || !this._config) {
      throw OLError.apiDisplayable({
        title: 'Not configured',
        message: 'Please configure Oliver Client with `configure` method.',
        type: ErrorType.hard,
      });
    }
    return this._apiClient;
  }

  // MARK: - Life Cycle

  public configure(env: Environment, userKey: KeyPair) {
    this._config = config[env];
    this._apiClient = new ApiClient(this._config.apiUrl, userKey);
  }
}

export const oliver = Oliver.instance;
