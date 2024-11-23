
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView, 
  Dimensions, 
  Image, 
  Alert, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { auth, db } from '../../config/firebaseConfig';
import { updateEmail, updatePassword, signOut } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
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
  const [email, setEmail] = useState(auth.currentUser.email);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [notifications, setNotifications] = useState(false);
  const [imageUri, setImageUri] = useState(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      setUsername(userData.username || '');
      setNotifications(userData.notifications || false);
      setImageUri(userData.imageUri || '');
    }
  };

  const handleSave = async () => {
    try {
      await updateEmail(auth.currentUser, email);
      if (password) {
        await updatePassword(auth.currentUser, password);
      }
      await updateDoc(doc(db, 'users', auth.currentUser.uid), {
        username,
        email,
        notifications,
        imageUri,
      });
      await AsyncStorage.setItem('profileImage', imageUri);
      Alert.alert('Profile updated successfully');
    } catch (error) {
      console.error(error);
      Alert.alert('Failed to update profile');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigation.navigate('Login');
    } catch (error) {
      console.error(error);
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
          <Text style={styles.headerTitle}>Profile</Text>
        </View>

        <View style={styles.formContainer}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.profileImage} />
          ) : (
            <Text style={styles.noImageText}>No profile image</Text>
          )}
          <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
            <Text style={styles.uploadButtonText}>Upload Profile Image</Text>
          </TouchableOpacity>

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
            <MaterialIcons name="person" size={20} color={COLORS.primaryLight} style={styles.inputIcon} />
            <TextInput
              placeholder="Username"
              placeholderTextColor={COLORS.text.muted}
              onChangeText={setUsername}
              value={username}
              style={styles.input}
            />
          </View>

          <View style={styles.inputContainer}>
            <MaterialIcons name="lock" size={20} color={COLORS.primaryLight} style={styles.inputIcon} />
            <TextInput
              placeholder="Password"
              placeholderTextColor={COLORS.text.muted}
              secureTextEntry
              onChangeText={setPassword}
              value={password}
              style={styles.input}
            />
          </View>

          <Text style={styles.notificationLabel}>Notifications</Text>
          <TouchableOpacity
            style={[
              styles.notificationButton,
              notifications ? styles.notificationEnabled : styles.notificationDisabled,
            ]}
            onPress={() => setNotifications(!notifications)}
          >
            <Text style={styles.notificationButtonText}>
              {notifications ? "Disable Notifications" : "Enable Notifications"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
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
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
    marginBottom: 20,
  },
  noImageText: {
    color: COLORS.text.muted,
    alignSelf: 'center',
    marginBottom: 20,
  },
  uploadButton: {
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  uploadButtonText: {
    color: COLORS.text.primary,
    fontSize: 16,
    fontFamily: 'Outfit',
  },
  notificationLabel: {
    color: COLORS.text.muted,
    fontSize: 14,
    marginLeft: 12,
    marginBottom: 8,
  },
  notificationButton: {
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  notificationEnabled: {
    backgroundColor: COLORS.primary,
  },
  notificationDisabled: {
    backgroundColor: COLORS.secondary,
  },
  notificationButtonText: {
    color: COLORS.text.primary,
    fontSize: 16,
    fontFamily: 'Outfit',
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  saveButtonText: {
    color: COLORS.text.primary,
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Outfit',
  },
  signOutButton: {
    backgroundColor: COLORS.secondary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  signOutButtonText: {
    color: COLORS.text.primary,
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Outfit',
  },
});
