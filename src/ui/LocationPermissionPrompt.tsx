import React from 'react';
import { View, Text, Button, Platform, Linking } from 'react-native';

// Open settings application, so user can grant location permission
const openSettings = () => {
  if (Platform.OS === 'ios') {
    Linking.openURL('app-settings:');
  } else {
    Linking.openSettings();
  }
};

const LocationPermissionPrompt = () => {
  return (
    <View>
      <Text>Location permission is required. Please enable it in Settings.</Text>
      <Button title="Open Settings" onPress={openSettings} />
    </View>
  );
};

export default LocationPermissionPrompt;
