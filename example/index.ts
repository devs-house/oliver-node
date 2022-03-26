// import { oliver } from 'oliver-core';

// oliver.configure('development', {
//   apiKey: '9qJIE436HQC2Awc98lIW',
//   apiSecret: '4Pffb1cDv5+ANBLlDacTadDqzbPYKleA0ad3F9HLN5c=',
// });

// const manageRoom = async () => {
//   const roomResponse = await createRoom({
//     title: 'Initial room',
//     overview: 'Initial room description',
//     media: {
//       square:
//         'https://firebasestorage.googleapis.com/v0/b/oliver-development-585f8.appspot.com/o/room_images%2F68e8e67c-abfc-4466-a3e4-06fa213824c7-1600?alt=media&token=027c25d6-0efd-4c1d-876a-85a8cc7f5eac',
//       horizontal:
//         'https://firebasestorage.googleapis.com/v0/b/oliver-development-585f8.appspot.com/o/room_images%2F7d9efb7b-b1d1-4588-bf68-14edc6969ff7-1200?alt=media&token=04ff1c1a-79cb-49ac-98e0-9b72634528be',
//       thumbnail:
//         'https://firebasestorage.googleapis.com/v0/b/oliver-development-585f8.appspot.com/o/room_images%2Fca1ee478-72cb-4af5-ae1f-ee8bcaa1b7eb-600?alt=media&token=abe49659-6bfc-417d-b683-95de4e831f67',
//     },
//     date: { start: 1648122421, end: 0 },
//     links: [
//       {
//         type: RoomLinkType.website,
//         name: 'IMDB',
//         url: 'https://www.imdb.com/title/tt9419884/',
//       },
//     ],
//     privacy_type: 'managed',
//     configuration: {
//       chat_enabled: true,
//       share_enabled: true,
//       see_more_enabled: true,
//       banners: [],
//       chat: {
//         ask_moderator: true,
//         channels: true,
//         one_to_one: true,
//         general: true,
//       },
//     },
//     location: null,
//     generate_keys: true,
//     access_codes: [],
//     tags: [],
//   });

//   if (roomResponse.success) {
//     const room = roomResponse.value;
//     await createInvitation({
//       type: 'moderator',
//       room_id: room.id,
//       first_name: 'Deniz',
//       last_name: 'Mersinlioglu',
//       email: 'deniz@devs.house',
//       notes: 'Hello world',
//     });
//   } else {
//     throw Error(`Room creation failed with ${roomResponse.error}`);
//   }
// };

// manageRoom();
