# Truffle Deployments

[![CircleCI][circleci-image]][circleci-url]
[![NPM Version][npm-image]][npm-url]
[![Coverage Status][coveralls-image]][coveralls-url]
[![License][license-image]][license-url]


Export deployed contract addresses and store them separately from Truffle artifacts.

## Why?

**Should I commit the build directory?**

If you ever worked with Truffle, I bet you asked yourself this question at least once.

There are different currents of thought between developers but there are a few unavoidable side effects in committing the *build* directory:

- the `updatedAt` field is updated every time a contract is compiled
- some user-specific `absolute paths` are stored inside every artifact and may cause problems when multiple persons are working on the same codebase
- `git diffs` become much more difficult and messy to read

But Truffle artifacts also contain the addresses of deployed contracts for each network and they are crucial for migrations in order to work properly.

The solution is to store those addresses in *separate files* and commit them instead of the *build* directory.

Later on, another dev working on the same codebase could just clone the repo, compile the contracts and merge the deployment address of each contract back with it's respective artifact file to restore a clean and working state for Truffle.


## Installation

```
npm install --save-dev truffle-deployments
```

## Usage

Truffle Deployments works in two stages:

1. **Export**: deployments are read from Truffle artifacts and stored into separate network-specific JSON files.
2. **Import**: previously exported deployments are merged back into Truffle artifacts.

The most common usage is through Command Line Interface but a Programmable API is available as well.

## Command Line Interface

### Export deployments

The export command will scan the `artifactsDir` and collect info about the deployments that were made on different networks for each contract. Then it will store the deployments in JSON files inside the `networksDir`, one for each network.

<br>

```
truffle-deployments export [artifactsDir] [networksDir]
```

<br>

| Option | Description |
| ------ | ----------- |
| `--network <network>, -n` | specify network/s to export (e.g. 1 or 1,4) |
| `--reset, -r` | delete old exported deployments |

\
If not specified, `artifactsDir` defaults to `build/contracts` and
`networksDir` defaults to `networks`.


If a network file already exists, by default Truffle Deployments will append new deployments without deleting the old ones with the exception of conflicting contracts that will be overwritten. To delete the old deployments consider using the `--reset` option.


Consider this initial state:

```jsonc
// build/contracts/Token.json

{
  "contractName": "Token",
  "abi": [],
  "bytecode": "0x60806040523480156200001157600080fd5b50604"
  "networks": {
    "1": {
      "events": {},
      "links": {},
      "address": "0xefE1e4e13F9ED8399eE8e258b3a1717b7D15f054",
      "transactionHash": "0x35db37ae85e2d4af8fb6fc83f1e6edf5ade8700cf75e19dc3f1a0307768948c7"
    },
    "4": {
      "events": {},
      "links": {},
      "address": "0xb56c770c2fa5222947a9e3c5beb8dc46dd656b5f",
      "transactionHash": "0xe31509629b75866917ab387751a75b737b973622d9765af69b557bde038e1210"
    }
  }
}
```

Running the `export` command will generate the following network files inside the `networksDir`:

```
networks/
  1.json
  4.json
```

Each network file contains all exported deployments:

```jsonc
// networks/1.json

[
  {
    "contract": "Token",
    "address": "0xefE1e4e13F9ED8399eE8e258b3a1717b7D15f054",
    "transactionHash": "0x35db37ae85e2d4af8fb6fc83f1e6edf5ade8700cf75e19dc3f1a0307768948c7"
  }
]
```

```jsonc
// networks/4.json

[
  {
    "contract": "Token",
    "address": "0xb56c770c2fa5222947a9e3c5beb8dc46dd656b5f",
    "transactionHash": "0xe31509629b75866917ab387751a75b737b973622d9765af69b557bde038e1210"
  }
]
```

### Import deployments

The import command will scan all the exported deployments inside the `networksDir` and merge them into respective contract artifact in the `artifactsDir`.

<br>

```
truffle-deployments import [networksDir] [artifactsDir]
```

<br>

| Option | Description |
| ------ | ----------- |
| `--network <network>, -n` | specify network/s to import (e.g. 1 or 1,4) |

\
If not specified, `artifactsDir` defaults to `build/contracts` and
`networksDir` defaults to `networks`.


Consider this initial state:

```jsonc
// networks/4.json

[
  {
    "contract": "Token",
    "address": "0xb56c770c2fa5222947a9e3c5beb8dc46dd656b5f",
    "transactionHash": "0xe31509629b75866917ab387751a75b737b973622d9765af69b557bde038e1210"
  }
]
```

```jsonc
// build/contracts/Token.json

{
  "contractName": "Token",
  "abi": [],
  "bytecode": "0x60806040523480156200001157600080fd5b50604"
  "networks": {
    "1": {
      "events": {},
      "links": {},
      "address": "0xefE1e4e13F9ED8399eE8e258b3a1717b7D15f054",
      "transactionHash": "0x35db37ae85e2d4af8fb6fc83f1e6edf5ade8700cf75e19dc3f1a0307768948c7"
    }
  }
}
```

Running the `import` command will update `build/contracts/Token.json` like this:

```jsonc
// build/contracts/Token.json

{
  "contractName": "Token",
  "abi": [],
  "bytecode": "0x60806040523480156200001157600080fd5b50604"
  "networks": {
    "1": {
      "events": {},
      "links": {},
      "address": "0xefE1e4e13F9ED8399eE8e258b3a1717b7D15f054",
      "transactionHash": "0x35db37ae85e2d4af8fb6fc83f1e6edf5ade8700cf75e19dc3f1a0307768948c7"
    },
    "4": {
      "events": {},
      "links": {},
      "address": "0xb56c770c2fa5222947a9e3c5beb8dc46dd656b5f",
      "transactionHash": "0xe31509629b75866917ab387751a75b737b973622d9765af69b557bde038e1210"
    }
  }
}
```

## Programmable API

Beside the Command Line Interface, Truffle Deployments can also be used programmatically.

### Export deployments

```javascript
const truffleDeployments = require('truffle-deployments');

const artifactsDir = 'build/contracts';
const networksDir = 'networks';
const options = { networks: [4], reset: true };

truffleDeployments.export(artifactsDir, networksDir, options);
```

### Import deployments

```javascript
const truffleDeployments = require('truffle-deployments');

const artifactsDir = 'build/contracts';
const networksDir = 'networks';
const options = { networks: [4] };

truffleDeployments.import(networksDir, artifactsDir, options);
```

[circleci-image]: https://circleci.com/gh/AleG94/truffle-deployments.svg?style=svg
[circleci-url]: https://circleci.com/gh/AleG94/truffle-deployments
[coveralls-image]: https://coveralls.io/repos/github/AleG94/truffle-deployments/badge.svg?branch=master
[coveralls-url]: https://coveralls.io/github/AleG94/truffle-deployments?branch=master
[npm-image]: https://img.shields.io/npm/v/truffle-deployments.svg
[npm-url]: https://npmjs.org/package/truffle-deployments
[license-image]: https://img.shields.io/npm/l/truffle-deployments.svg
[license-url]: https://github.com/AleG94/truffle-deployments/blob/master/LICENSE