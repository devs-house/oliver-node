import { createInvitation, createRoom, oliver } from 'oliver-core';
import { RoomLinkType } from 'oliver-core/dist/types';

// 'development' | 'staging' | 'production'
oliver.configure('development', {
  apiKey: 'YOUR_API_KEY',
  apiSecret: 'YOUR_API_SECRET',
});

const manageRoom = async () => {
  const roomResponse = await createRoom({
    title: 'Initial room',
    overview: 'Initial room description',
    media: {
      square: 'SQUARE_LARGE_IMAGE (1:1)',
      horizontal: 'HORIZONTAL_LARGE_IMAGE (106:46)',
      thumbnail: 'SQUARE_SMALL_IMAGE (1:1)',
    },
    date: {
      start: 1648122421 /* TIME_STAMP_SECONDS */,
      end: 0 /* TIME_STAMP_SECONDS */,
    },
    links: [
      {
        type: RoomLinkType.website,
        name: 'LINK_TITLE',
        url: 'LINK_IMAGE',
      },
    ],
    privacy_type: 'managed', // ROOM_PRIVACY_TYPE
    configuration: {
      chat_enabled: true,
      share_enabled: true,
      see_more_enabled: true,
      banners: [
        {
          link: 'BANNER_LINK',
          image_url: 'BANNER_IMAGE_URL',
        },
      ],
      chat: {
        ask_moderator: true,
        channels: true,
        one_to_one: true,
        general: true,
      },
    },
    location: null,
    generate_keys: true,
    access_codes: [],
    tags: [],
  });

  if (roomResponse.type === 'success') {
    const room = roomResponse.value;
    await createInvitation({
      type: 'moderator', // 'admin' | 'member' | 'moderator'
      room_id: room.id,
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@__gmail__.com',
      notes: 'Some notes to the invited user',
    });
  } else {
    throw Error(`Room creation failed with ${roomResponse.error}`);
  }
};

manageRoom();
