import { ApiClient } from './apiClient';
import { config, Config, Environment } from './config';
import { invitationRepository } from './repositories/invitationRepository';
import { roomRepository } from './repositories/roomRepository';
import { userRepository } from './repositories/userRepository';
import { KeyPair } from './types';

export class OliverClient {
  // MARK: - Properties

  readonly config: Config;
  readonly userKey: KeyPair;
  readonly apiClient: ApiClient;

  // MARK: - Life Cycle

  constructor(env: Environment, userKey: KeyPair) {
    this.config = config[env];
    this.userKey = userKey;
    this.apiClient = new ApiClient(this.config.apiUrl, userKey);
  }

  // MARK: - Entry Points

  public user = () => userRepository(this.apiClient);
  public room = (roomKey?: KeyPair) => roomRepository(this.apiClient, roomKey);
  public invitation = (roomKey?: KeyPair) =>
    invitationRepository(this.apiClient, roomKey);
}
