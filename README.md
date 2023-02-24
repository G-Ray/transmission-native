# transmission-native

Native bindings for libtransmission.

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Installation

The package is not yet published to npm. Please refer to [development](#development).

## Usage

```js
const Transmission = require('transmission-native')

// Create a transmission instance with config folder and app name
const tr = new Transmission('./transmission', 'transmission')

const response = await tr.request({ method: 'session-get' })


// Add a new torrent
const message = {
    method: 'torrent-add',
    arguments: {
        filename: 'https://webtorrent.io/torrents/tears-of-steel.torrent'
    }
}

const reponse = await tr.request(messages)
console.log(response)

// Later, when the process should be stopped, close the instance before
tr.close()
```

Please refer to transmission's [rpc-spec.md](https://github.com/transmission/transmission/blob/4.0.0/docs/rpc-spec.md) to find what methods and arguments are expected.

## API

### `tr = new Transmission(configDir, appName)`

Create a transmission instance with a specific configuration folder and application name.\
`configDir` is the path where settings and state of the transmission process will be loaded and stored.

### `tr.request(message)`

Make a request to the transmission instance.
`message` is an object expected by transmissions's [rpc-spec.md](https://github.com/transmission/transmission/blob/4.0.0/docs/rpc-spec.md).


```js
const message = { method: 'session-get' }

const reponse = await tr.request(messages)
console.log(response)

// or as a callback
tr.request(message, (err, response) => {
  if (err) throw err
  console.log(response)
})
```

## Development

You'll need to install required build tools and libraries for your platform in order to compile libtransmission.

```sh
npm run fetch-deps
npm run build-transmission
npm install
npm test # optional
```

## License

GPL-3.0
