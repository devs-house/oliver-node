import { map, propOr } from 'ramda';
import { ApiClient } from '../apiClient';
import { Result, success } from '../entities/Result';
import { parseRoom, parseRoomKey, parseRoomLink, parseUser } from '../typeMaps';
import {
  Room,
  RoomConfiguration,
  RoomKey,
  RoomLink,
  RoomLocation,
  RoomMainMedia,
  RoomPrivacyType,
  User,
} from '../types';

type RoomResponse = Result<{
  room: Room;
  publishers: User[];
  links: RoomLink[];
}>;

type RoomArrayResponse = Result<{
  rooms: Room[];
  publishers: User[];
  links: RoomLink[];
}>;

type RoomKeyResponse = Result<{
  room: Room;
  key: RoomKey;
}>;

export const roomRepository = (apiClient: ApiClient) => ({
  fetchRoom: async (roomId: string, accessCode?: string): Promise<RoomResponse> => {
    const response = await apiClient.request({
      request: {
        method: 'GET',
        endPoint: '/room',
        parameters: {
          id: roomId,
          access_code: accessCode,
        },
      },
    });

    switch (response.type) {
      case 'success':
        const json = response.value;
        const room = parseRoom(json['room']);
        const publishers = map(parseUser, propOr([], 'publishers', json));
        const links = map(parseRoomLink, propOr([], 'links', json));
        return success({ room, publishers, links });

      case 'error':
        return response;
    }
  },

  fetchCollaboratedRooms: async (
    publisherId: string,
    ignoreStatus: boolean,
    lastUpdatedAt: number,
  ): Promise<RoomArrayResponse> => {
    const response = await apiClient.request({
      request: {
        method: 'GET',
        endPoint: '/rooms/collaborated',
        parameters: {
          publisher_id: publisherId,
          last_updated_at: lastUpdatedAt,
          ignore_status: ignoreStatus,
        },
      },
    });

    switch (response.type) {
      case 'success':
        const json = response.value;
        return success({
          rooms: map(parseRoom, propOr([], 'rooms', json)),
          publishers: map(parseUser, propOr([], 'publishers', json)),
          links: map(parseRoomLink, propOr([], 'links', json)),
        });

      case 'error':
        return response;
    }
  },

  createRoom: async (request: CreateRoomRequest): Promise<RoomResponse> => {
    const response = await apiClient.request({
      request: {
        method: 'POST',
        endPoint: '/room',
        parameters: { ...request },
      },
    });

    switch (response.type) {
      case 'success':
        const json = response.value;
        const room = parseRoom(json['room']);
        const links = map(parseRoomLink, propOr([], 'links', json));
        return success({ room, publishers: [], links });

      case 'error':
        return response;
    }
  },

  updateRoom: async (request: UpdateRoomRequest): Promise<RoomResponse> => {
    const response = await apiClient.request({
      request: {
        method: 'PUT',
        endPoint: '/room',
        parameters: { ...request },
      },
    });

    switch (response.type) {
      case 'success':
        const json = response.value;
        const room = parseRoom(json['room']);
        const publishers = map(parseUser, propOr([], 'publishers', json));
        const links = map(parseRoomLink, propOr([], 'links', json));
        return success({ room, publishers, links });

      case 'error':
        return response;
    }
  },

  deleteRoom: async (roomId: string): Promise<Result<Room>> => {
    const response = await apiClient.request({
      request: {
        method: 'DELETE',
        endPoint: '/room',
        parameters: { room_id: roomId },
      },
    });

    switch (response.type) {
      case 'success':
        const json = response.value;
        const room = parseRoom(json['room']);
        return success(room);

      case 'error':
        return response;
    }
  },

  fetchRoomKeys: async (roomId: string): Promise<RoomKeyResponse> => {
    const response = await apiClient.request({
      request: {
        method: 'GET',
        endPoint: '/room/secret/keys',
        parameters: { room_id: roomId },
      },
    });

    switch (response.type) {
      case 'success':
        const json = response.value;
        const room = parseRoom(json['room']);
        const roomKey = parseRoomKey(json['key']);
        return success({ room, key: roomKey });

      case 'error':
        return response;
    }
  },

  refreshRoomKeys: async (apiKey: string, roomId: string): Promise<RoomKeyResponse> => {
    const response = await apiClient.request({
      request: {
        method: 'POST',
        endPoint: '/room/secret/keys',
        parameters: { api_key: apiKey, room_id: roomId },
      },
    });

    switch (response.type) {
      case 'success':
        const json = response.value;
        const room = parseRoom(json['room']);
        const roomKey = parseRoomKey(json['key']);
        return success({ room, key: roomKey });

      case 'error':
        return response;
    }
  },
});

export type CreateRoomRequest = {
  title: string;
  overview: string;
  start_date: number;
  end_date: number;
  privacy_type: RoomPrivacyType;
  access_codes: string[];
  tags: string[];
  link_ids: string[];
  api_key: string | null;
  api_secret: string | null;
  media: Partial<RoomMainMedia>;
  config: Partial<RoomConfiguration>;
  location: Partial<RoomLocation> | null;
};

export type UpdateRoomRequest = {
  room_id: string;
  title: string;
  overview: string;
  start_date: number;
  end_date: number;
  privacy_type: RoomPrivacyType;
  link_ids: string[];
  access_codes: string[];
  tags: string[];
  media: Partial<RoomMainMedia>;
  config: Partial<RoomConfiguration>;
  location: Partial<RoomLocation> | undefined;
};
