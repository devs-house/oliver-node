import { OliverClient } from 'oliver-core';

const client = new OliverClient('development', {
  apiKey: '9qJIE436HQC2Awc98lIW',
  apiSecret: '4Pffb1cDv5+ANBLlDacTadDqzbPYKleA0ad3F9HLN5c=',
});

const manageRoom = async () => {
  // tslint:disable-next-line: no-console
  // await client.room().createRoom({
  //   title: 'Hello world',
  //   overview: 'Hello world overview',
  //   start_date: 1648210042,
  //   end_date: 0,
  //   access_codes: [],
  //   privacy_type: 'managed',
  // });
};

manageRoom();
