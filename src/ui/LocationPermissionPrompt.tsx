import React from 'react';
import { View, Text, Platform, Linking, StyleSheet, Modal } from 'react-native';
import LargeButton from '../components/LargeButton';

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
    <Modal transparent={true}>
      <View style={styles.overlay}>
        <View style={styles.alertBox}>
          <Text style={styles.alertText}>
            Location permission is required. Please enable it in Settings and restart the
            app.
          </Text>
          <LargeButton title="Open Settings" onPress={openSettings} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertBox: {
    backgroundColor: '#343534',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
    elevation: 5,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  alertText: {
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 16,
    color: '#fff',
  },
});

export default LocationPermissionPrompt;
