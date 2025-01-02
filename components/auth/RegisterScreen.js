


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
  Dimensions,
  Alert
} from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../config/firebaseConfig';
import { MaterialIcons } from '@expo/vector-icons';

const COLORS = {
  primary: '#8B5CF6',
  primaryDark: '#7C3AED',
  primaryLight: '#A78BFA',
  secondary: '#4C1D95',
  background: '#1E1B4B',
  surface: '#2D2A4A',
  text: {
    primary: '#FFFFFF',
    secondary: '#E5E7EB',
    muted: '#9CA3AF',
  }
};

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const validatePassword = () => {
    if (password.length < 8) {
      Alert.alert('Invalid Password', 'Password must be at least 8 characters long');
      return false;
    }
    if (password !== confirmPassword) {
      Alert.alert('Password Mismatch', 'Passwords do not match');
      return false;
    }
    return true;
  };

  const createUserDocument = async (uid) => {
    try {
      const userRef = doc(db, 'users', uid);
      await setDoc(userRef, {
        email,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        username:'',
        imageUri: '',
       
      });
    } catch (error) {
      console.error('Error creating user document:', error);
      throw error;
    }
  };

  const handleRegister = async () => {
    if (!validatePassword()) return;

    setLoading(true);
    try {
      // Create authentication user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Create Firestore document
      await createUserDocument(userCredential.user.uid);

      Alert.alert(
        'Success!',
        'Your account has been created successfully.',
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
      );
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert(
        'Registration Failed',
        error.message || 'Please check your information and try again'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color={COLORS.text.primary} />
        </TouchableOpacity>

        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Create Account</Text>
          <Text style={styles.subtitle}>Join MicMagic today</Text>
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
              editable={!loading}
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
              editable={!loading}
            />
            <TouchableOpacity 
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}
              disabled={loading}
            >
              <MaterialIcons 
                name={showPassword ? "visibility" : "visibility-off"} 
                size={20} 
                color={COLORS.text.muted}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <MaterialIcons name="lock" size={20} color={COLORS.primaryLight} style={styles.inputIcon} />
            <TextInput
              placeholder="Confirm Password"
              placeholderTextColor={COLORS.text.muted}
              secureTextEntry={!showConfirmPassword}
              onChangeText={setConfirmPassword}
              value={confirmPassword}
              style={[styles.input, styles.passwordInput]}
              editable={!loading}
            />
            <TouchableOpacity 
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              style={styles.eyeIcon}
              disabled={loading}
            >
              <MaterialIcons 
                name={showConfirmPassword ? "visibility" : "visibility-off"} 
                size={20} 
                color={COLORS.text.muted}
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.passwordRequirements}>
            Password must be at least 8 characters long
          </Text>

          <TouchableOpacity 
            style={[
              styles.registerButton,
              loading && { opacity: 0.7 }
            ]} 
            onPress={handleRegister}
            disabled={loading}
          >
            <Text style={styles.registerButtonText}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </Text>
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')} disabled={loading}>
              <Text style={styles.loginLink}>Sign In</Text>
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
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1,
    padding: 8,
  },
  headerContainer: {
    alignItems: 'center',
    marginTop: Dimensions.get('window').height * 0.1,
    marginBottom: 40,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    fontFamily: 'Outfit',
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
    paddingRight: 50,
  },
  eyeIcon: {
    position: 'absolute',
    right: 12,
    height: '100%',
    justifyContent: 'center',
  },
  passwordRequirements: {
    color: COLORS.text.muted,
    fontSize: 12,
    fontFamily: 'Outfit',
    marginTop: -8,
    marginBottom: 24,
    marginLeft: 12,
  },
  registerButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  registerButtonText: {
    color: COLORS.text.primary,
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Outfit',
    letterSpacing: 0.5,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  loginText: {
    color: COLORS.text.secondary,
    fontFamily: 'Outfit',
    fontSize: 16,
  },
  loginLink: {
    color: COLORS.primary,
    fontFamily: 'Outfit',
    fontSize: 16,
    fontWeight: '600',
  },
});