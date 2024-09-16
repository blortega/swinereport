import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import FeedScreen from './screens/historyfeed';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{
            title: 'Welcome Home',
            headerStyle: {
              backgroundColor: '#4B4B4B', // Match the HomeScreen background color
            },
            headerTintColor: '#fff', // White text color for the header
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }} 
        />
        <Stack.Screen 
          name="Feed" 
          component={FeedScreen} 
          options={{
            title: 'Back',
            headerStyle: {
              backgroundColor: '#4B4B4B', // Match the HomeScreen background color
            },
            headerTintColor: '#fff', // White text color for the header
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
