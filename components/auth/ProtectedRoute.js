
import React from 'react';
import { View, Text } from 'react-native';
import { auth } from '../../config/firebaseConfig';

const ProtectedRoute = ({ children, navigation }) => {
  const user = auth.currentUser;

  if (!user) {
    return <Text>You need to login to access this page.</Text>;
  }

  // Pass navigation prop to children
  return React.cloneElement(children, { navigation });
};

export default ProtectedRoute;

