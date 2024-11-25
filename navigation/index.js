// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
// import LoginScreen from '../components/auth/LoginScreen';
// import RegisterScreen from '../components/auth/RegisterScreen';
// import ProfileScreen from '../components/auth/ProfileScreen';
// import ProtectedRoute from '../components/auth/ProtectedRoute';
// import AudioRecording from '../components/audio/AudioRecording';

// const Stack = createStackNavigator();

// export default function AppNavigator() {
//   const [isAuthenticated, setIsAuthenticated] = React.useState(false); 

//   return (
//     <NavigationContainer>
//       <Stack.Navigator>
//         <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }}/>
//         <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
//         <Stack.Screen name="AudioRecording" component={AudioRecording}  />
//         <Stack.Screen name="Profile">
//           {() => (
//             <ProtectedRoute isAuthenticated={isAuthenticated}>
//               <ProfileScreen />
//             </ProtectedRoute>
//           )}
//         </Stack.Screen>
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }

import React from 'react'; 
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity, Text } from 'react-native';
import LoginScreen from '../components/auth/LoginScreen';
import RegisterScreen from '../components/auth/RegisterScreen';
import ProfileScreen from '../components/auth/ProfileScreen';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import AudioRecording from '../components/audio/AudioRecording';

const Stack = createStackNavigator();

export default function AppNavigator() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/* Login Screen */}
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }} 
        />
        {/* Register Screen */}
        <Stack.Screen 
          name="Register" 
          component={RegisterScreen} 
          options={{ headerShown: false }} 
        />
        {/* Protected AudioRecording Screen */}
        <Stack.Screen 
          name="AudioRecording" 
          options={({ navigation }) => ({
            title:"MicMagic",
            headerStyle: {
              backgroundColor: '#ff6347',
            },
            headerLeft: () => null,
            headerRight: () => (
              <TouchableOpacity
                onPress={() => navigation.navigate('Profile')}
                style={{ marginRight: 10 }}
              >
                <Text>👤</Text> 
              </TouchableOpacity>
            ),
          })}
        >
          {() => (
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <AudioRecording />
            </ProtectedRoute>
          )}
        </Stack.Screen>
        {/* Protected Profile Screen */}
        <Stack.Screen name="Profile"
      
       
        options={{
          title: 'User Profile',
          headerStyle: {
            backgroundColor: '#ff6347', 
          },
        }}>
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
