/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import type {Node} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import {
  Agent,
  InitConfig,
  ConnectionEventTypes,
  ConnectionStateChangedEvent,
  WsOutboundTransport,
  HttpOutboundTransport,
  DidExchangeState,
  OutOfBandRecord,
} from '@aries-framework/core';
import {agentDependencies} from '@aries-framework/react-native';
import {ConsoleLogger, LogLevel} from '@aries-framework/core';

const Section = ({children, title}): Node => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
};

// const setupConnectionListener = (
//   agent: Agent,
//   outOfBandRecord: OutOfBandRecord,
//   cb: (...args: any) => void,
// ) => {
//   agent.events.on<ConnectionStateChangedEvent>(
//     ConnectionEventTypes.ConnectionStateChanged,
//     ({payload}) => {
//       if (payload.connectionRecord.outOfBandId !== outOfBandRecord.id) {
//         return;
//       }
//       if (payload.connectionRecord.state === DidExchangeState.Completed) {
//         // the connection is now ready for usage in other protocols!
//         console.log(
//           `Connection for out-of-band id ${outOfBandRecord.id} completed`,
//         );

//         // Custom business logic can be included here
//         // In this example we can send a basic message to the connection, but
//         // anything is possible
//         cb();

//         // We exit the flow
//         process.exit(0);
//       }
//     },
//   );
// };

const receiveInvitation = async (agent: Agent, invitationUrl: string) => {
  const {outOfBandRecord} = await agent.oob.receiveInvitationFromUrl(
    invitationUrl,
  );
  console.log('recieve invitation');
  console.log(outOfBandRecord);
  return outOfBandRecord;
};

const App: () => Node = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const config: InitConfig = {
    label: 'demo-agent-bob',
    walletConfig: {
      id: 'mainBob',
      key: 'demoagentbob00000000000000000000',
    },
    logger: new ConsoleLogger(LogLevel.info),
    autoAcceptConnections: true,
  };

  const agent = new Agent(config, agentDependencies);

  agent.registerOutboundTransport(new WsOutboundTransport());
  agent.registerOutboundTransport(new HttpOutboundTransport());

  const initialise = async () => {
    await agent.initialize().catch(console.error);
    await invitation()
      .then(result => {
        console.log(result);
      })
      .catch(console.error);
  };

  const invitation = async () => {
    await receiveInvitation(
      agent,
      'https://www.google.com/?oob=eyJAdHlwZSI6Imh0dHBzOi8vZGlkY29tbS5vcmcvb3V0LW9mLWJhbmQvMS4xL2ludml0YXRpb24iLCJAaWQiOiJkYjMyNDY2My1hNjUzLTQwMjUtYjU4ZS03MGJiNmE0NDJlMDIiLCJsYWJlbCI6ImRlbW8tYWdlbnQtYWNtZSIsImFjY2VwdCI6WyJkaWRjb21tL2FpcDEiLCJkaWRjb21tL2FpcDI7ZW52PXJmYzE5Il0sImhhbmRzaGFrZV9wcm90b2NvbHMiOlsiaHR0cHM6Ly9kaWRjb21tLm9yZy9kaWRleGNoYW5nZS8xLjAiLCJodHRwczovL2RpZGNvbW0ub3JnL2Nvbm5lY3Rpb25zLzEuMCJdLCJzZXJ2aWNlcyI6W3siaWQiOiIjaW5saW5lLTAiLCJzZXJ2aWNlRW5kcG9pbnQiOiJodHRwOi8vbG9jYWxob3N0OjMwMDEiLCJ0eXBlIjoiZGlkLWNvbW11bmljYXRpb24iLCJyZWNpcGllbnRLZXlzIjpbImRpZDprZXk6ejZNa3N2VzlLZjRpNmQzZzdDRUVoWVBSUkdWZm85bWRqTVpjQzlIR3ZvRGp1RGtZIl0sInJvdXRpbmdLZXlzIjpbXX1dfQ',
    );
  };

  initialise();

  console.log();
  // setupConnectionListener();

  // receiveInvitation();

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          {/* Todo: add input field for invitation */}
          {/* Todo: add button to receive invitation */}
          <Section title="Step One">
            Edit <Text style={styles.highlight}>App.js</Text> to change this
            screen and then come back to see your edits.
          </Section>
          <Section title="See Your Changes">
            <ReloadInstructions />
          </Section>
          <Section title="Debug">
            <DebugInstructions />
          </Section>
          <Section title="Learn More">
            Read the docs to discover what to do next:
          </Section>
          <LearnMoreLinks />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
