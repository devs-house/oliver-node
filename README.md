# Oliver Core

Oliver client for NodeJs application integration.

#### Install

```
npm install oliver-core
// or
yarn add oliver-core
```

#### Initialization

Create an account from Oliver Platform. ([development](development.olvr.app), [staging](staging.olvr.app), [production](olvr.app))

```ts
import { OliverClient } from 'oliver-core';

// Choose environment 'development' | 'staging' | 'production'
// Retrieve your user keys from platform account settings.
const oliver = new OliverClient('development', {
  apiKey: '<key>',
  apiSecret: '<secret>',
});
```
