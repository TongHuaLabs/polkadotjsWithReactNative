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
    const Gavin = "5D18bgh1CtovjnMgJ6eEe8c7ZmKgenR8onjYwD5qeKNbp5QU";
    let gavinBalance = await api.query.balances.freeBalance(Gavin);
    this.setState({
      aliceBalance: aliceBalance.toString(),
      gavinBalance: gavinBalance.toString()
    })

    // transfer 500 to Gavin
    const keyring = new Keyring({ type: "sr25519" }); 
    const alice = keyring.addFromUri("//Alice");
    // const keyring = new Keyring({ type: "ed25519" }); 
    // const gavin = keyring.addFromUri("//Gavin");
    // gavin.address equals to "5D18bgh1CtovjnMgJ6eEe8c7ZmKgenR8onjYwD5qeKNbp5QU"
    // alice.address = 5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY
    const extrinsic = api.tx.balances.transfer(Gavin, 500);
    // Sign and send the transaction using our account
    const hash = await extrinsic.signAndSend(alice);
    this.setState({
      transactionHash: hash.toString(16)
    })
  }

  render() {
    let { 
      blockNumber, 
      chainInfo, 
      aliceBalance, 
      gavinBalance,
      transactionHash
     } = this.state;

    return (
      <Fragment>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView>
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={styles.scrollView}
          >
            <Header />
            <View style={styles.body}>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Chain Information</Text>
                <Text style={styles.sectionDescription}>{chainInfo}</Text>
              </View>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Block Number</Text>
                <Text style={styles.sectionDescription}>
                  Current Block Number: {blockNumber}
                </Text>
              </View>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Read Chain State</Text>
                <Text style={styles.sectionDescription}>
                  Alice balance: {aliceBalance} Unit {"\n"}
                  Gavin balance: {gavinBalance} Unit
                </Text>
              </View>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Transfer from Alice to Gavin</Text>
                <Text style={styles.sectionDescription}>
                  TX: {transactionHash}
                </Text>
              </View>
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
