# Using polkadot-js with React Native
A boilertemplate for using polkadot-js with React Native (>= 0.60.0)

### Features
- Support RN >= 0.60.0
- Can successfully read chain state
- Can transfer funds by signing transactions with ed25519 keys

### Test Environment
```
node: 12.5.0
yarn: 1.13.0
react: 16.8.6
react-native: 0.60.0
@polkadot/api: ^0.81.1
@polkadot/keyring: ^0.93.1

Operating System
iOS Simuator: iPhone X iOS 12.1
Android Simulator: AVD Nexus 5X API 27
```


## Setup
1. `git clone git@github.com:hashpire/polkadotjsWithReactNative.git`
2. `yarn install`
3. Run substrate node (https://github.com/paritytech/substrate)
```
cd substrate
cargo run -- --dev
```
4. Transfer funds from Alice(sr25519) to Gavin (ed25519)
```
Alice address: 5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY
Gavin address: 5D18bgh1CtovjnMgJ6eEe8c7ZmKgenR8onjYwD5qeKNbp5QU

1. Open address book on polkadot apps - https://polkadot.js.org/apps/#/addressbook
2. Add Gavin
3. Transfer 5000 from Alice to Gavin

Note: For now we can only sign transactions with ed25519 keys, since the default Alice key is sr25519, we cannot transfer funds from Alice in the RN app.
```
5. `yarn react-native run-ios` or `yarn react-native run-android`

## Step By Step Guide
1. Create a new React Native Project
```
npx react-native init polkadotjsWithReactNative
```
2. Install Node core modules for React Native
```
yarn add node-libs-react-native
yarn add vm-browserify
yarn add bs58
```
3. In the project root directory, edit `metro.config.js`
```
const nodeLibs = require("node-libs-react-native");
nodeLibs.bs58 = require.resolve("bs58");
nodeLibs.vm = require.resolve("vm-browserify");

module.exports = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false
      }
    })
  },
  resolver: {
    extraNodeModules: nodeLibs
  }
};
```
4. At the top of `index.js`, add the followings
```
import 'node-libs-react-native/globals';
```
5. Install and Link `react-native-randombytes`
```
yarn add react-native-randombytes
cd ios
pod install
cd ..
```
7. Install @polkadot/api
```
yarn add @polkadot/api
yarn add @polkadot/keyring
```
8. Import and Test   

9. Run
```
yarn react-native run-ios
// yarn react-native run-android
```

### TODO
- Add WebAssembly polyfill to support sr25519 and other features. More info on this here: https://github.com/polkadot-js/wasm/issues/19