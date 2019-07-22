# Using polkadot-js with React Native
A boilertemplate for using polkadot-js with React Native (>= 0.60.0)

### Features
- Support RN >= 0.60.0
- Can successfully read chain state
- Can transfer funds by signing transactions with ed25519 keys

### Test Environment
```
node: 12.5.0
yarn: 1.17.3
react: 16.8.6
react-native: 0.60.4
@polkadot/api: ^0.81.1
@polkadot/keyring: ^0.94.1

Operating System
iOS Simuator: iPhone X iOS 12.1
Android Simulator: AVD Nexus 5X API 27
```


## Setup
1. `git clone git@github.com:hashpire/polkadotjsWithReactNative.git`
2. `yarn install`
3. `cd ios && pod install && cd ..`
4. Run substrate node (https://github.com/paritytech/substrate)
```
cd substrate
cargo run -- --dev
```
5. `yarn start`
6. `yarn react-native run-ios` or `yarn react-native run-android`

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

### References
- Uses asm.js as fallback for wasm - https://github.com/polkadot-js/wasm/issues/19