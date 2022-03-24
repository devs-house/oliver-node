import { OliverClient } from 'oliver-core';

const client = new OliverClient('development', {
  apiKey: '9qJIE436HQC2Awc98lIW',
  apiSecret: '4Pffb1cDv5+ANBLlDacTadDqzbPYKleA0ad3F9HLN5c=',
});

const manageRoom = async () => {
  const room = await client.createRoom(
    'Initial room',
    'Initial room description',
    {
      square: '',
      horizontal: '',
    },
    { start: 0, end: 0 },
    [],
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

  // const invitation = await client.inviteUser('moderator',)
};

manageRoom();
