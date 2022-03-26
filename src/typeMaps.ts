import { map, prop, propOr } from 'ramda';
import {
  Invitation,
  Room,
  RoomConfiguration,
  RoomKey,
  RoomLink,
  RoomLocation,
  RoomMedia,
  User,
  UserSettings,
} from './types';

// MARK: - User

export const parseUser = (json: User): User => ({
  id: prop('id', json),
  firebase_uid: prop('firebase_uid', json),
  auth_types: prop('auth_types', json),
  email: prop('email', json),
  first_name: prop('first_name', json),
  last_name: prop('last_name', json),
  user_name: prop('user_name', json),
  image_url: prop('image_url', json),
  is_publisher: prop('is_publisher', json),
  is_anonymous: prop('is_anonymous', json),
  notification_token: prop('notification_token', json),
  is_active: prop('is_active', json),
});

export const parseUserSettings = (json: UserSettings): UserSettings => ({
  id: prop('id', json),
  auto_set_notification: prop('auto_set_notification', json),
  auto_set_calendar_event: prop('auto_set_calendar_event', json),
  updated_at: prop('updated_at', json),
});

// MARK: - Room

export const parseRoom = (json: Room): Room => ({
  id: prop('id', json),
  title: prop('title', json),
  overview: prop('overview', json),
  start_date: prop('start_date', json),
  end_date: prop('end_date', json),
  privacy_type: prop('privacy_type', json),
  short_link: prop('short_link', json),

  publisher_id: prop('publisher_id', json),
  status: propOr('created_at', 'status', json),
  publish_date: propOr(0, 'updated_at', json),
  purchase_ids: propOr([], 'purchase_ids', json),

  config: parseRoomConfiguration(json.config),
  main_media: parseRoomMainMedia(json.main_media),
  location: json.location ? parseRoomLocation(json.location) : null,
  links: map(parseRoomLink, propOr([], 'links', json)),
  access_codes: propOr([], 'access_codes', json),
  tags: propOr([], 'tags', json),

  created_at: propOr(0, 'created_at', json),
  updated_at: propOr(0, 'updated_at', json),
  is_active: propOr(false, 'is_active', json),
});

export const parseRoomConfiguration = (
  json: RoomConfiguration,
): RoomConfiguration => ({
  chat: {
    general: propOr(false, 'general', json?.chat),
    channels: propOr(false, 'channels', json?.chat),
    one_to_one: propOr(false, 'one_to_one', json?.chat),
    ask_moderator: propOr(false, 'ask_moderator', json?.chat),
  },
  chat_enabled: propOr(false, 'chat_enabled', json),
  share_enabled: propOr(false, 'share_enabled', json),
  see_more_enabled: propOr(false, 'see_more_enabled', json),
  banners: (json?.banners ?? []).map((banner) => ({
    link: prop('link', banner),
    image_url: prop('image_url', banner),
  })),
});

export const parseRoomMainMedia = (json: RoomMedia): RoomMedia => ({
  url: prop('url', json),
  thumbnail_url: prop('thumbnail_url', json),
  web_banner_url: prop('web_banner_url', json),
});

export const parseRoomLink = (json: RoomLink): RoomLink => ({
  id: prop('id', json),
  name: prop('name', json),
  url: prop('url', json),
  type: prop('type', json),
});

export const parseRoomLocation = (json: RoomLocation): RoomLocation => ({
  address: prop('address', json),
  title: prop('title', json),
  latitude: prop('latitude', json),
  longitude: prop('longitude', json),
  province: propOr(null, 'province', json),
  city: propOr(null, 'city', json),
  country: propOr(null, 'country', json),
  zip_code: propOr(null, 'country', json),
});

export const parseRoomKey = (json: RoomKey): RoomKey => ({
  api_key: prop('api_key', json),
  api_secret: prop('api_secret', json),
  room_id: propOr(null, 'room_id', json),
});

export const parseInvitation = (json: Invitation): Invitation => ({
  id: prop('id', json),
  email: prop('email', json),
  notes: prop('notes', json),
  invited_at: prop('invited_at', json),
  invited_by_id: prop('invited_by_id', json),
  created_at: prop('created_at', json),
  updated_at: prop('updated_at', json),
  is_active: prop('is_active', json),
  first_name: prop('first_name', json),
  last_name: prop('last_name', json),
  room_id: prop('room_id', json),
  status: prop('status', json),
  invited_user_id: prop('invited_user_id', json),
  collaborator_access_level: propOr(null, 'collaborator_access_level', json),
  invitation_type: prop('invitation_type', json),
  notify_on_accept: prop('notify_on_accept', json),
  notify_on_accept_email: prop('notify_on_accept_email', json),
});
