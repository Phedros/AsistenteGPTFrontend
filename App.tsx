import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/screens/HomeScreen';
import CreateGPTScreen from './src/screens/CreateGPTScreen';
import EditGPTScreen from './src/screens/EditGPTScreen';
import ChatScreen from './src/screens/ChatScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import ConversationListScreen from './src/screens/ConversationListScreen';
import CreateFlujoScreen from './src/screens/CreateFlujoScreen';
import RunFlujoScreen from './src/screens/RunFlujoScreen';
import FlujosScreen from './src/screens/FlujosScreen';  // Nueva pantalla para flujos
import FlujoDetailScreen from './src/screens/FlujoDetailScreen';  // Nueva pantalla para detalle de flujos

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        {/* Pantalla Home */}
        <Stack.Screen name="Home" component={HomeScreen} />

        {/* Pantalla para crear un nuevo GPT */}
        <Stack.Screen name="CreateGPT" component={CreateGPTScreen} />

        {/* Pantalla para editar un GPT existente */}
        <Stack.Screen name="EditGPT" component={EditGPTScreen} />

        {/* Pantalla para listar conversaciones */}
        <Stack.Screen
          name="ConversationList"
          component={ConversationListScreen}
          options={{ title: 'Conversaciones' }}
        />

        {/* Pantalla de chat */}
        <Stack.Screen name="ChatScreen" component={ChatScreen} />

        {/* Pantalla de ajustes */}
        <Stack.Screen name="Settings" component={SettingsScreen} />

        {/* Pantalla para crear un flujo */}
        <Stack.Screen
          name="CreateFlujo"
          component={CreateFlujoScreen}
          options={{ title: 'Crear Flujo' }}
        />

        {/* Pantalla para mostrar lista de flujos */}
        <Stack.Screen
          name="Flujos"
          component={FlujosScreen}
          options={{ title: 'Lista de Flujos' }}
        />

        {/* Pantalla para detalles de un flujo */}
        <Stack.Screen
          name="FlujoDetail"
          component={FlujoDetailScreen}
          options={{ title: 'Detalle del Flujo' }}
        />

        {/* Pantalla para correr un flujo */}
        <Stack.Screen
          name="RunFlujo"
          component={RunFlujoScreen}
          options={{ title: 'Correr Flujo' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
