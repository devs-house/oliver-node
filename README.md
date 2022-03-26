# Oliver Core

Oliver client for NodeJs application integration.

### Initialization

```
npm install oliver-core
// or
yarn add oliver-core
```

Create an account from Oliver Platform. ([development](https://development.olvr.app), [staging](https://staging.olvr.app), [production](https://olvr.app))

```ts
import { oliver } from '.';

// Choose environment 'development' | 'staging' | 'production'
// Retrieve your user keys from platform account settings.
oliver.configure('<ENV>', {
  apiKey: '<API_KEY>',
  apiSecret: '<API_SECRET>',
});
```

---

### Usage

#### Create Room

```ts
import { createInvitation } from '.';

const response = await createRoom({
  /*See Parameters*/
});

if (response.type === 'success') {
  const room = response.value;
  console.log(room);
} else {
  throw Error(`Room creation failed with ${response.error}`);
}
```

| Field                              | Type                           | Required | Description                                                                       |
| ---------------------------------- | ------------------------------ | -------- | --------------------------------------------------------------------------------- |
| `title`                            | `string`                       | YES      | Name of the room                                                                  |
| `overview`                         | `string`                       | YES      | Description of the room                                                           |
| `media`                            | `RoomMedia`                    | YES      | Room media (requires 3 types of images)                                           |
| `media.square`                     | `string`                       | YES      | Square image url with aspect ratio (1:1)                                          |
| `media.horizontal`                 | `string`                       | YES      | Horizontal image with aspect ratio (106:46)                                       |
| `media.thumbnail`                  | `string`                       | YES      | Thumbnail image with aspect ratio (1:1)                                           |
| `date`                             | `{start: number, end: number}` | YES      | Content launch date, dates of the related event, meeting or product release       |
| `date.start`                       | `number`                       | YES      | Start timestamp (unix - seconds) of the launch                                    |
| `date.end`                         | `number`                       | NO       | End timestamp (unix - seconds) of the launch                                      |
| `links`                            | `Array<RoomLink>`              | YES      | Content related links that will be listed in the room                             |
| `privacy_type`                     | `RoomPrivacyType`              | YES      | Privacy type of the room. Determines user access level and type                   |
| `generate_keys`                    | `boolean`                      | YES      | Generates `RoomKeys` for the room. Must be `true` if privacy level is `managed`   |
| `accessCodes`                      | `Array<string>`                | YES      | Access codes for private rooms. Must be `not-empty` if privacy level is `private` |
| `location`                         | `RoomLocation \ null`          | YES      | Venue geo location                                                                |
| `tags`                             | `Array<string>`                | YES      | Tags for the room, will be using for indexing and search.                         |
| `configuration`                    | `RoomConfiguration`            | YES      | Customization configurations for the room                                         |
| `configuration.chat_enabled`       | `boolean`                      | YES      | Enable room chat                                                                  |
| `configuration.share_enabled`      | `boolean`                      | YES      | Enable room sharing by members                                                    |
| `configuration.see_more_enabled`   | `boolean`                      | YES      | Enable `PublisherSection` of room home that members see your other rooms          |
| `configuration.banners`            | `Array<RoomBanner>`            | YES      | Banners for branding                                                              |
| `configuration.chat.general`       | `boolean`                      | YES      | Enable general chat                                                               |
| `configuration.chat.ask_moderator` | `boolean`                      | YES      | Enable moderator-member direct chat, customer support for your members            |
| `configuration.chat.channels`      | `boolean`                      | YES      | Enable topic based chat channels                                                  |
| `configuration.chat.one_to_one`    | `boolean`                      | YES      | Enable one to one private chat between your room members                          |

#### Invite Admins, Moderators and Members

By creating `admin/moderator` invitation, **collaboration** e-mail is sent navigating user to the `platform`.
By creating `member` invitation, **participation** e-mail is sent navigating user to join the `room`.

```ts
import { createInvitation } from '.';

const response = await createInvitation({
  /*See Parameters*/
});

if (response.type === 'success') {
  const invitation = response.value;
  console.log(invitation);
} else {
  throw Error(`Room creation failed with ${response.error}`);
}
```

| Field        | Type             | Required | Description                                                  |
| ------------ | ---------------- | -------- | ------------------------------------------------------------ |
| `type`       | `InvitationType` | YES      | Invitation type `admin`, `moderator` or `member`             |
| `room_id`    | `string`         | YES      | Room identifier                                              |
| `first_name` | `string`         | YES      | First name of the invited user                               |
| `last_name`  | `string`         | YES      | Last name of the invited user                                |
| `email`      | `string`         | YES      | Email address of the invited user                            |
| `notes`      | `string`         | NO       | Personal notes that will be attached to the invitation email |
