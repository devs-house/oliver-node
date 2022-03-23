import { apiClient, ApiTarget } from './apiClient';
import { config, Config, Environment } from './config';
import { roomRepository } from './repositories/roomRepository';
import { userRepository } from './repositories/userRepository';

export type KeyPair = { apiKey: string; apiSecret: string };

export class OliverClient {
  // MARK: - Properties

  readonly config: Config;
  readonly userKeys: KeyPair;
  private accessToken?: string;
  private refreshToken?: (target: ApiTarget) => Promise<string>;
  private revokeToken?: (target: ApiTarget) => Promise<void>;

  // MARK: - Life Cycle

  constructor(env: Environment, userKeys: KeyPair) {
    this.config = config[env];
    this.userKeys = userKeys;
  }

  // MARK: - Repositories

  public user = () => userRepository(this.client());
  public room = (roomKeys: KeyPair) => roomRepository(this.client(roomKeys));

  // MARK: - Helpers

  private client = (roomKeys?: KeyPair) => {
    return apiClient(
      this.config.apiUrl,
      {
        'api-key': this.userKeys.apiKey,
        'api-secret': this.userKeys.apiSecret,
        'room-key': roomKeys?.apiKey ?? '',
        'room-secret': roomKeys?.apiSecret ?? '',
      },
      this.accessToken ?? '',
      async (target) => this.refreshToken?.(target) ?? '',
      async (target) => this.revokeToken?.(target),
    );
  };
}
