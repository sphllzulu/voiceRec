import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Dimensions, Image, Alert, KeyboardAvoidingView, Platform,ActivityIndicator } from 'react-native';
import { auth, db} from '../../config/firebaseConfig';
import { updateEmail, updatePassword, signOut, sendEmailVerification,reauthenticateWithCredential,EmailAuthProvider } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
// import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
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

export default function ProfileScreen({ navigation }) {
  const [email, setEmail] = useState(auth.currentUser?.email || '');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [notifications, setNotifications] = useState(false);
  const [imageUri, setImageUri] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    loadUserData();
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Sorry, we need camera roll permissions to make this work!');
      }
    })();
  }, []);

  const loadUserData = async () => {
    try {
      const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUsername(userData.username || '');
        setNotifications(userData.notifications || false);
        setImageUri(userData.photoURL || null);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      Alert.alert('Error', 'Failed to load user data');
    }
  };
  

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
  
    if (!result.canceled) {
      const { uri } = result.assets[0];
      setImageUri(uri);
    }
  };

  
  const reauthenticate = async () => {
    if (!currentPassword) {
      throw new Error('Current password is required');
    }
    const credential = EmailAuthProvider.credential(auth.currentUser.email, currentPassword);
    await reauthenticateWithCredential(auth.currentUser, credential);
  };

  const handleSave = async () => {
    if (loading) return;
    
    setLoading(true);
    try {
      // If email is being changed
      if (email !== auth.currentUser.email) {
        await reauthenticate();
        await updateEmail(auth.currentUser, email);
        await sendEmailVerification(auth.currentUser);
        Alert.alert(
          'Verification Required',
          'Please check your email to verify your new email address'
        );
      }

      // If password is being changed
      if (password) {
        await reauthenticate();
        await updatePassword(auth.currentUser, password);
      }

      // Update user document
      await updateDoc(doc(db, 'users', auth.currentUser.uid), {
        username,
        email,
        notifications,
        updatedAt: new Date().toISOString()
      });

      Alert.alert('Success', 'Profile updated successfully');
      setPassword('');
      setCurrentPassword('');
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert(
        'Error',
        error.message || 'Failed to update profile'
      );
    } finally {
      setLoading(false);
    }
  };

  //signout logic
  const handleSignOut = async () => {
    try {
      await AsyncStorage.clear();
      await signOut(auth);
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error('Error signing out:', error);
      Alert.alert('Error', 'Failed to sign out');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.headerContainer}>
          
        </View>

        <View style={styles.formContainer}>
          <View style={styles.imageContainer}>
            {uploadingImage ? (
              <ActivityIndicator size="large" color={COLORS.primary} />
            ) : imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.profileImage} />
            ) : (
              <View style={[styles.profileImage, styles.placeholderImage]}>
                <MaterialIcons name="person" size={40} color={COLORS.text.muted} />
              </View>
            )}
            <TouchableOpacity 
              style={[styles.uploadButton, uploadingImage && styles.disabledButton]} 
              onPress={pickImage}
              disabled={uploadingImage}
            >
              <Text style={styles.uploadButtonText}>
                {uploadingImage ? 'Uploading...' : 'Change Photo'}
              </Text>
            </TouchableOpacity>
          </View>

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
            <MaterialIcons name="person" size={20} color={COLORS.primaryLight} style={styles.inputIcon} />
            <TextInput
              placeholder="Username"
              placeholderTextColor={COLORS.text.muted}
              onChangeText={setUsername}
              value={username}
              style={styles.input}
              editable={!loading}
            />
          </View>

          {(email !== auth.currentUser?.email || password) && (
            <View style={styles.inputContainer}>
              <MaterialIcons name="lock" size={20} color={COLORS.primaryLight} style={styles.inputIcon} />
              <TextInput
                placeholder="Current Password"
                placeholderTextColor={COLORS.text.muted}
                secureTextEntry
                onChangeText={setCurrentPassword}
                value={currentPassword}
                style={styles.input}
                editable={!loading}
              />
            </View>
          )}

          <View style={styles.inputContainer}>
            <MaterialIcons name="lock" size={20} color={COLORS.primaryLight} style={styles.inputIcon} />
            <TextInput
              placeholder="New Password (optional)"
              placeholderTextColor={COLORS.text.muted}
              secureTextEntry
              onChangeText={setPassword}
              value={password}
              style={styles.input}
              editable={!loading}
            />
          </View>

          <TouchableOpacity 
            style={[styles.saveButton, loading && styles.disabledButton]} 
            onPress={handleSave}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.text.primary} />
            ) : (
              <Text style={styles.saveButtonText}>Save Changes</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.signOutButton} 
            onPress={handleSignOut}
            disabled={loading}
          >
            <Text style={styles.signOutButtonText}>Sign Out</Text>
          </TouchableOpacity>
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
    marginTop: Dimensions.get('window').height * 0.05,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    fontFamily: 'Outfit',
  },
  formContainer: {
    paddingHorizontal: 24,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  placeholderImage: {
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
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
  uploadButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: 'center',
  },
  uploadButtonText: {
    color: COLORS.text.primary,
    fontSize: 14,
    fontFamily: 'Outfit',
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  saveButtonText: {
    color: COLORS.text.primary,
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Outfit',
  },
  signOutButton: {
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.primaryLight + '40',
  },
  signOutButtonText: {
    color: COLORS.text.primary,
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Outfit',
  },
  disabledButton: {
    opacity: 0.7,
  },
});










