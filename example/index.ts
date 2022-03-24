import { OliverClient } from 'oliver-core';

const client = new OliverClient('development', {
  apiKey: '9qJIE436HQC2Awc98lIW',
  apiSecret: '4Pffb1cDv5+ANBLlDacTadDqzbPYKleA0ad3F9HLN5c=',
});

const manageRoom = async () => {
  // tslint:disable-next-line: no-console
  console.info(client);
};

manageRoom();
