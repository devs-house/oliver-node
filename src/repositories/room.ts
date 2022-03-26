import { map, propOr } from 'ramda';
import { oliver } from '..';
import { Result, success } from '../entities/Result';
import { parseRoom, parseRoomKey } from '../typeMaps';
import {
  Room,
  RoomConfiguration,
  RoomKey,
  RoomLink,
  RoomLocation,
  RoomMedia,
  RoomPrivacyType,
} from '../types';

export const fetchRoom = async (roomId: string): Promise<Result<Room>> => {
  const response = await oliver.apiClient.request({
    request: {
      method: 'GET',
      endPoint: '/room',
      parameters: { id: roomId },
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
};

export const fetchCollaboratedRooms = async (
  publisherId: string,
): Promise<Result<Room[]>> => {
  const response = await oliver.apiClient.request({
    request: {
      method: 'GET',
      endPoint: '/rooms/collaborated',
      parameters: {
        publisher_id: publisherId,
        ignore_status: true,
      },
    },
  });

  switch (response.type) {
    case 'success':
      const json = response.value;
      return success(map(parseRoom, propOr([], 'rooms', json)));

    case 'error':
      return response;
  }
};

export const createRoom = async (parameters: {
  title: string;
  overview: string;
  date: { start: number; end?: number };
  media: RoomMedia;
  links: Pick<RoomLink, 'name' | 'url' | 'type'>[];
  privacy_type: RoomPrivacyType;
  configuration: RoomConfiguration;
  location: RoomLocation | null;
  generate_keys: boolean;
  access_codes: string[];
  tags: string[];
}): Promise<Result<Room>> => {
  const response = await oliver.apiClient.request({
    request: {
      method: 'POST',
      endPoint: '/room',
      parameters: { ...parameters },
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
};

export const updateRoom = async (parameters: {
  room_id: string;
  title?: string;
  overview?: string;
  date?: { start: number; end: number };
  privacy_type?: RoomPrivacyType;
  links?: RoomLink[];
  media?: RoomMedia;
  config?: RoomConfiguration;
  location?: RoomLocation | null;
  access_codes?: string[];
  tags?: string[];
}): Promise<Result<Room>> => {
  const response = await oliver.apiClient.request({
    request: {
      method: 'PUT',
      endPoint: '/room',
      parameters: { ...parameters },
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
};

export const deleteRoom = async (roomId: string): Promise<Result<Room>> => {
  const response = await oliver.apiClient.request({
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
};

export const fetchRoomKeys = async (
  roomId: string,
): Promise<
  Result<{
    room: Room;
    key: RoomKey;
  }>
> => {
  const response = await oliver.apiClient.request({
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
      const key = parseRoomKey(json['key']);
      return success({ room, key });

    case 'error':
      return response;
  }
};

export const refreshRoomKeys = async (
  apiKey: string,
  roomId: string,
): Promise<
  Result<{
    room: Room;
    key: RoomKey;
  }>
> => {
  const response = await oliver.apiClient.request({
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
      const key = parseRoomKey(json['key']);
      return success({ room, key });

    case 'error':
      return response;
  }
};
