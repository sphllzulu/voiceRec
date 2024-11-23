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
  const [isAuthenticated, setIsAuthenticated] = React.useState(false); 

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
        <Stack.Screen name="AudioRecording" component={AudioRecording}  />
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

// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
// import LoginScreen from '../components/auth/LoginScreen';
// import RegisterScreen from '../components/auth/RegisterScreen';
// import ProfileScreen from '../components/auth/ProfileScreen';
// import ProtectedRoute from '../components/auth/ProtectedRoute';
// import AudioRecording from '../components/audio/AudioRecording';

// const Stack = createStackNavigator();

// const ProtectedScreen = ({ component: Component, isAuthenticated, ...rest }) => (
//   <ProtectedRoute isAuthenticated={isAuthenticated}>
//     <Component {...rest} />
//   </ProtectedRoute>
// );

// export default function AppNavigator() {
//   const [isAuthenticated, setIsAuthenticated] = React.useState(false);

//   return (
//     <NavigationContainer>
//       <Stack.Navigator>
//         <Stack.Screen 
//           name="Login" 
//           component={LoginScreen} 
//           options={{ headerShown: false }} 
//         />
//         <Stack.Screen 
//           name="Register" 
//           component={RegisterScreen} 
//           options={{ headerShown: false }} 
//         />
//         <Stack.Screen 
//           name="AudioRecording"
//         >
//           {props => (
//             <ProtectedScreen 
//               component={AudioRecording} 
//               isAuthenticated={isAuthenticated} 
//               {...props} 
//             />
//           )}
//         </Stack.Screen>
//         <Stack.Screen 
//           name="Profile"
//         >
//           {props => (
//             <ProtectedScreen 
//               component={ProfileScreen} 
//               isAuthenticated={isAuthenticated} 
//               {...props} 
//             />
//           )}
//         </Stack.Screen>
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }
