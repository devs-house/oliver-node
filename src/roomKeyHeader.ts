import { KeyPair } from './types';

export const roomKeyHeader = (roomKey?: KeyPair): Record<string, string> => {
  return roomKey
    ? {
        'room-key': roomKey.apiKey,
        'room-secret': roomKey.apiKey,
      }
    : {};
};
