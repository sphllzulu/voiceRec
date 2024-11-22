
// import React, { useState } from 'react';
// import { View, Text, TextInput, Button } from 'react-native';
// import { signInWithEmailAndPassword } from 'firebase/auth';
// import { auth } from '../../config/firebaseConfig';

// export default function LoginScreen({ navigation }) {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   const handleLogin = async () => {
//     try {
//       await signInWithEmailAndPassword(auth, email, password);
//       navigation.navigate('AudioRecording');
//     } catch (error) {
//       console.error(error);
//       alert('Login failed');
//     }
//   };

//   return (
//     <View>
//       <Text>Login</Text>
//       <TextInput placeholder="Email" onChangeText={setEmail} value={email} />
//       <TextInput placeholder="Password" secureTextEntry onChangeText={setPassword} value={password} />
//       <Button title="Login" onPress={handleLogin} />
//       <Button title="Register" onPress={() => navigation.navigate('Register')} />
//     </View>
//   );
// }


import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Dimensions
} from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../config/firebaseConfig';
import { MaterialIcons } from '@expo/vector-icons';

const COLORS = {
  primary: '#8B5CF6', // Main purple
  primaryDark: '#7C3AED', // Darker purple for hover/active states
  primaryLight: '#A78BFA', // Lighter purple for accents
  secondary: '#4C1D95', // Deep purple for contrast
  background: '#1E1B4B', // Dark navy background
  surface: '#2D2A4A', // Slightly lighter surface color
  text: {
    primary: '#FFFFFF',
    secondary: '#E5E7EB',
    muted: '#9CA3AF',
  }
};

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigation.navigate('AudioRecording');
    } catch (error) {
      console.error(error);
      alert('Login failed. Please check your credentials and try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Welcome to</Text>
          <Text style={styles.appTitle}>MicMagic</Text>
          <Text style={styles.subtitle}>Record, Share, Create</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <MaterialIcons name="email" size={20} color={COLORS.primaryLight} style={styles.inputIcon} />
            <TextInput
              placeholder="Email"
              placeholderTextColor={COLORS.text.muted}
              onChangeText={setEmail}
              value={email}
              style={styles.input}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputContainer}>
            <MaterialIcons name="lock" size={20} color={COLORS.primaryLight} style={styles.inputIcon} />
            <TextInput
              placeholder="Password"
              placeholderTextColor={COLORS.text.muted}
              secureTextEntry={!showPassword}
              onChangeText={setPassword}
              value={password}
              style={[styles.input, styles.passwordInput]}
            />
            <TouchableOpacity 
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}
            >
              <MaterialIcons 
                name={showPassword ? "visibility" : "visibility-off"} 
                size={20} 
                color={COLORS.text.muted}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Sign In</Text>
          </TouchableOpacity>

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.registerLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardView: {
    flex: 1,
  },
  headerContainer: {
    alignItems: 'center',
    marginTop: Dimensions.get('window').height * 0.1,
    marginBottom: 40,
  },
  headerTitle: {
    fontSize: 24,
    color: COLORS.text.secondary,
    fontFamily: 'Outfit',
    marginBottom: 8,
  },
  appTitle: {
    fontSize: 40,
    fontWeight: 'bold',
    color: COLORS.primary,
    fontFamily: 'Outfit',
    letterSpacing: 1,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.text.muted,
    fontFamily: 'Outfit',
  },
  formContainer: {
    paddingHorizontal: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.primaryLight + '40',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputIcon: {
    padding: 12,
  },
  input: {
    flex: 1,
    height: 50,
    color: COLORS.text.primary,
    fontFamily: 'Outfit',
    fontSize: 16,
    paddingRight: 12,
  },
  passwordInput: {
    paddingRight: 50, // Make room for the eye icon
  },
  eyeIcon: {
    position: 'absolute',
    right: 12,
    height: '100%',
    justifyContent: 'center',
  },
  loginButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  loginButtonText: {
    color: COLORS.text.primary,
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Outfit',
    letterSpacing: 0.5,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  registerText: {
    color: COLORS.text.secondary,
    fontFamily: 'Outfit',
    fontSize: 16,
  },
  registerLink: {
    color: COLORS.primary,
    fontFamily: 'Outfit',
    fontSize: 16,
    fontWeight: '600',
  },
});