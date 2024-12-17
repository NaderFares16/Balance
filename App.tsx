import * as React from 'react';

import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import { SQLiteProvider } from 'expo-sqlite';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

import Home from './src/app/Home';
import { Loading } from './src/components/loading';

const Stack = createNativeStackNavigator();

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
    <NavigationContainer>
      <React.Suspense
        fallback={
          <Loading />
        }
      >
        <SQLiteProvider databaseName='database.db' useSuspense>
          <Stack.Navigator>
            <Stack.Screen 
              name='Home'
              component={Home}
              options={{
                headerTitle: "Balance",
                headerLargeTitle: true,
              }}
            />
          </Stack.Navigator>
        </SQLiteProvider>
      </React.Suspense>
    </NavigationContainer>
  );
}
