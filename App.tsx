import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { Loading } from './components/loading';

import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import * as React from 'react';

const loadDatabase = async () => {
  const dbName = "database.db";
  const dbAsset = require("./assets/database.db");
  const dbURI = Asset.fromModule(dbAsset).uri;
  const dbFilePath = `${FileSystem.documentDirectory}SQLite/${dbName}`;

  const fileInfo = await FileSystem.getInfoAsync(dbFilePath);

  if (!fileInfo.exists) {
    await FileSystem.makeDirectoryAsync(
      `${FileSystem.documentDirectory}SQLite`,
      { intermediates: true }
    );
    await FileSystem.downloadAsync(dbURI, dbFilePath);
  }

}

export default function App() {

  const [dbLoaded, setDbLoaded] = React.useState<boolean>(false)

  React.useEffect(() => {
    loadDatabase().then(() => {
      setDbLoaded(true)
    }).catch((e) => console.error(e));
  }, []);

  if (!dbLoaded) return <Loading />

  return (
    <View style={styles.container}>
      <Text>Open up App.tsx to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
