// app/components/auth/ProfileScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { auth } from '../../config/firebaseConfig';
import { updateEmail, signOut } from 'firebase/auth';

export default function ProfileScreen({ navigation }) {
  const [email, setEmail] = useState(auth.currentUser.email);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigation.navigate('Login');
    } catch (error) {
      console.error(error);
    }
  };

  const handleSave = async () => {
    try {
      await updateEmail(auth.currentUser, email);
      alert('Email updated successfully');
    } catch (error) {
      console.error(error);
      alert('Failed to update email');
    }
  };

  return (
    <View>
      <Text>Profile</Text>
      <TextInput placeholder="Email" onChangeText={setEmail} value={email} />
      <Button title="Save" onPress={handleSave} />
      <Button title="Sign out" onPress={handleSignOut} />
    </View>
  );
}
