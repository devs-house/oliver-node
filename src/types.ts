export type KeyPair = { apiKey: string; apiSecret: string };

export type InvitationType = 'admin' | 'moderator' | 'member';

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

  main_media: RoomMedia;
  location: RoomLocation | null;

  links: RoomLink[];
  access_codes: string[];
  tags: string[];
  config: RoomConfiguration;

  created_at: number;
  updated_at: number;
  is_active: boolean;
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
  banners: { link: string; image_url: string }[];
};

export type RoomStatus = 'creating' | 'published';
export type RoomPrivacyType = 'public' | 'private' | 'managed' | 'invite-only';

export type RoomMedia = {
  url: string;
  thumbnail_url: string;
  web_banner_url: string;
};

export type RoomLink = {
  id: string | null;
  type: RoomLinkType;
  name: string;
  url: string;
};

export type RoomLocation = {
  address: string;
  title: string;
  latitude: number;
  longitude: number;
  province: string;
  city: string;
  country: string;
  zip_code: number;
};

export enum RoomLinkType {
  facebook = 0,
  twitter,
  instagram,
  email,
  linkedIn,
  website,
  youtube,
  zoom,
}

export type RoomKey = {
  api_key: string;
  api_secret: string;
  room_id: string;
};

export enum AccessLevel {
  admin = 0,
  moderator = 1,
}

export type Invitation = {
  id: string;
  email: string;
  notes: string;
  first_name: string;
  last_name: string;
  room_id: string;
  status: 'accepted' | 'pending';
  notify_on_accept: boolean;
  notify_on_accept_email: string;
  invitation_type: 'subscriber' | 'collaborator';
  invited_user_id: string;
  invited_at: number;
  collaborator_access_level: AccessLevel | null;
  invited_by_id: string;
  created_at: number;
  updated_at: number;
  is_active: boolean;
};
