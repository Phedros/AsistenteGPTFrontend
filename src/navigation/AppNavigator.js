import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import CreateGPTScreen from '../screens/CreateGPTScreen';
import EditGPTScreen from '../screens/EditGPTScreen';
import ChatScreen from '../screens/ChatScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="CreateGPT" component={CreateGPTScreen} />
        <Stack.Screen name="EditGPT" component={EditGPTScreen} />
        <Stack.Screen name="ChatScreen" component={ChatScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
