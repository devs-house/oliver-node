import { OliverClient } from 'oliver-core';
import { RoomLinkType } from 'oliver-core/dist/types';

const client = new OliverClient('development', {
  apiKey: '9qJIE436HQC2Awc98lIW',
  apiSecret: '4Pffb1cDv5+ANBLlDacTadDqzbPYKleA0ad3F9HLN5c=',
});

const manageRoom = async () => {
  try {
    const room = await client.createRoom(
      'Initial room',
      'Initial room description',
      {
        square:
          'https://firebasestorage.googleapis.com/v0/b/oliver-development-585f8.appspot.com/o/room_images%2F68e8e67c-abfc-4466-a3e4-06fa213824c7-1600?alt=media&token=027c25d6-0efd-4c1d-876a-85a8cc7f5eac',
        horizontal:
          'https://firebasestorage.googleapis.com/v0/b/oliver-development-585f8.appspot.com/o/room_images%2F7d9efb7b-b1d1-4588-bf68-14edc6969ff7-1200?alt=media&token=04ff1c1a-79cb-49ac-98e0-9b72634528be',
      },
      { start: 1648122421, end: 0 },
      [
        {
          type: RoomLinkType.website,
          name: 'IMDB',
          url: 'https://www.imdb.com/title/tt9419884/',
        },
      ],
      'managed',
      {
        chat_enabled: true,
        share_enabled: true,
        see_more_enabled: true,
        banners: [],
      },
      null,
      [],
    );

    const invitation = await client.inviteUser(
      'moderator',
      room.id,
      'Deniz',
      'Mersinlioglu',
      'deniz@devs.house',
      'Hello world',
    );
  } catch (error: any) {
    console.error(error);
  }
};

manageRoom();
