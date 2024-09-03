import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/screens/HomeScreen';
import CreateGPTScreen from './src/screens/CreateGPTScreen';
import EditGPTScreen from './src/screens/EditGPTScreen';
import ChatScreen from './src/screens/ChatScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import ConversationListScreen from './src/screens/ConversationListScreen'; // Importar la nueva pantalla

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="CreateGPT" component={CreateGPTScreen} />
        <Stack.Screen name="EditGPT" component={EditGPTScreen} />
        <Stack.Screen name="ConversationList" component={ConversationListScreen} options={{ title: 'Conversaciones' }} />
        <Stack.Screen name="ChatScreen" component={ChatScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
