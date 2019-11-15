# dharma-version-api
An API for getting the current version of the Dharma Smart Wallet and the Dharma Key Ring from infura in a format accepted by shields.io

```
INFURA_API_KEY=<api-key> node index.js
```

Exposes:
- https://dharma-version-api.netlify.com/.netlify/functions/server?target=smartwallet
- https://dharma-version-api.netlify.com/.netlify/functions/server?target=keyring

Returns:

```
{"schemaVersion":1,"label":"Smart Wallet version","message":"3","color":"blue"}
```
