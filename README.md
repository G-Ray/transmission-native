# transmission-native

Native bindings for libtransmission.

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Installation

The npm package offers prebuilt binaries only for Linux x64 for now.
Please refer to [development](#development) for other systems.

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

const reponse = await tr.request(message)
console.log(response)

// Save settings
tr.saveSettings()

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

const reponse = await tr.request(message)
console.log(response)

// or as a callback
tr.request(message, (err, response) => {
  if (err) throw err
  console.log(response)
})
```

### `tr.saveSettings()`

Save transmission settings.

### `tr.close()`

Save settings and close the session.

## Development

You'll need to install required build tools and libraries for your platform in order to compile libtransmission:

## Fedora / RHEL
```sh
sudo dnf install cmake gcc-c++ libcurl-devel openssl-devel
```

## Windows
```sh
vcpkg install curl --triplet=x64-windows-static
vcpkg install openssl --triplet=x64-windows
```

```sh
npm run fetch-deps
# For Windows you need to set VCPKG_INSTALLATION_ROOT env variable
npm run build-transmission
npm install
npm test # optional
```

## License

GPL-3.0
