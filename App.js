/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Fragment} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import { ApiPromise, WsProvider } from '@polkadot/api';
import { Keyring } from '@polkadot/keyring';
import { u8aToHex } from "@polkadot/util";
import {
  bip39Generate,
  bip39ToSeed,
  waitReady
} from "@polkadot/wasm-crypto";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      blockNumber: 0,
      chainInfo: '',
      aliceBalance: 0,
      transactionHash: ''
    }

    // Initialise the provider to connect to the local node
    const providerUrl = Platform.select({
      ios: "ws://localhost:9944",
      android: "ws://10.0.2.2:9944"
    });
    this.provider = new WsProvider(providerUrl);
  }

  async componentDidMount() {
    const api = await ApiPromise.create({
      provider: this.provider
    });

    // Retrieve the chain & node information information via rpc calls
    const [chain, nodeName, nodeVersion] = await Promise.all([
      api.rpc.system.chain(),
      api.rpc.system.name(),
      api.rpc.system.version()
    ]);
    this.setState({
      chainInfo: `You are connected to chain ${chain} using ${nodeName} v${nodeVersion}`
    });

    // get latest block number
    const unsubscribe = await api.rpc.chain.subscribeNewHead(
      header => {
        this.setState({
          blockNumber: `${header.blockNumber}`
        });
      }
    );
    
    // get alice balance
    const Alice = "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY";
    let aliceBalance = await api.query.balances.freeBalance(Alice);
    aliceBalance = aliceBalance.toString();
    this.setState({
      aliceBalance
    })

    // await waitReady();

    // // transfer to bob
    // const Bob = "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty";
    // // Construct the keyring after the API (crypto has an async init)
    // const keyring = new Keyring({ type: "sr25519" });
    // // // // Add alice to our keyring with a hard-deived path (empty phrase, so uses dev)
    // try {
    //   const alice = keyring.addFromUri("//Alice");
    //   // // // Create a extrinsic, transferring 12345 units to Bob
    //   const extrinsic = api.tx.balances.transfer(Bob, 12345);
    //   // // Sign and send the transaction using our account
    //   const hash = await extrinsic.signAndSend(alice);
    // }
    // catch(e) {
    //   this.setState({
    //     chainInfo: e.toString()
    //   })
    // }

    // generate phrase
    // const phrase = bip39Generate();
 
    // // get ed25519 seed from phrase
    // const seed = bip39ToSeed('test', '');
    // this.setState({
    //   transactionHash: phrase
    // })

  }

  render() {
    let { blockNumber, chainInfo, aliceBalance, transactionHash } = this.state;

    return (
      <Fragment>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView>
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={styles.scrollView}>
            <Header />
            <View style={styles.body}>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Chain Information</Text>
                <Text style={styles.sectionDescription}>
                  { chainInfo }
                </Text>
              </View>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Block Number</Text>
                <Text style={styles.sectionDescription}>
                  Current Block Number: { blockNumber }
                </Text>
              </View>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Read Chain State</Text>
                <Text style={styles.sectionDescription}>
                  Alice balance: { aliceBalance } Unit
                </Text>
              </View>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Transfer</Text>
                <Text style={styles.sectionDescription}>
                  { transactionHash }
                </Text>
              </View>
              <LearnMoreLinks />
            </View>
          </ScrollView>
        </SafeAreaView>
      </Fragment>
    );
  }
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
