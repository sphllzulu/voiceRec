
import React from 'react';
import { View, Text } from 'react-native';
import { auth } from '../../config/firebaseConfig';

const ProtectedRoute = ({ children }) => {
  const user = auth.currentUser;

  if (!user) {
    return <Text>You need to login to access this page.</Text>;
  }

  return children;
};

export default ProtectedRoute;

