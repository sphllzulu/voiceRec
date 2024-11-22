// app/navigation/index.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../components/auth/LoginScreen';
import RegisterScreen from '../components/auth/RegisterScreen';
import ProfileScreen from '../components/auth/ProfileScreen';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import AudioRecording from '../components/audio/AudioRecording';

const Stack = createStackNavigator();

export default function AppNavigator() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false); // This state can be updated based on your authentication logic

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="AudioRecording" component={AudioRecording} />
        <Stack.Screen name="Profile">
          {() => (
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <ProfileScreen />
            </ProtectedRoute>
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
