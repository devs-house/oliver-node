export type User = {
  id: string;
  firebase_uid: string;
  auth_types: string[];
  email: string;
  first_name: string;
  last_name: string;
  user_name: string;
  image_url: string;
  is_publisher: boolean;
  is_anonymous: boolean;
  notification_token: string;
  is_active: boolean;
};

export type UserSettings = {
  id: string;
  auto_set_notification: boolean;
  auto_set_calendar_event: boolean;
  updated_at: number;
};

export type RoomDateSegment = 'active' | 'past' | 'live';
export type RoomStatus = 'creating' | 'published';
export type RoomPrivacyType = 'public' | 'private' | 'managed' | 'invite-only';

export type Room = {
  id: string;
  title: string;
  overview: string;
  start_date: number;
  end_date: number;
  privacy_type: RoomPrivacyType;
  short_link: string;

  publisher_id: string;
  status: RoomStatus;
  publish_date: number;
  purchase_ids: string[];

  main_media: RoomMainMedia;
  location?: RoomLocation;
  config: RoomConfiguration;

  link_ids: string[];
  access_codes: string[];
  tags: string[];

  created_at: number;
  updated_at: number;
  is_active: boolean;

  is_demo?: boolean;
};

export type RoomMainMedia = {
  id: string;
  is_active: boolean;
  type: string;
  url: string;
  thumbnail_url: string;
  web_banner_url: string;
};

export type RoomConfiguration = {
  chat: {
    general: boolean;
    channels: boolean;
    one_to_one: boolean;
    ask_moderator: boolean;
  };
  chat_enabled: boolean;
  share_enabled: boolean;
  see_more_enabled: boolean;
  banners: RoomBanner[];
};

export type RoomBanner = {
  link: string;
  image_url: string;
};

export type RoomLink = {
  id: string;
  name: string;
  url: string;
  type: number;
  owner_id: string;
  is_active: boolean;
  created_at: number;
  updated_at: number;
};

export type RoomLocation = {
  id: string;
  address: string;
  title: string;
  latitude: number;
  longitude: number;
  is_active: boolean;
  province: string;
  city: string;
  country: string;
  zip_code: number;
};

export type RoomKey = {
  api_key: string;
  api_secret: string;
  room_id: string | null;
};
