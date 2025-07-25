import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Button,
  View,
  Dimensions,
  Alert,
  Linking,
  Platform,
  Text,
  AppState,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import Geolocation from '@react-native-community/geolocation';
import LocationPermissionPrompt from './components/LocationPermissionPrompt.tsx';

const deviceHeight = Dimensions.get('window').height;

Geolocation.setRNConfiguration({
  skipPermissionRequests: false,
  authorizationLevel: 'whenInUse',
});

const MapScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [permissionStatus, setPermissionStatus] = useState(true);

  useEffect(() => {
    requestPermissions();

    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        requestPermissions();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const requestPermissions = () => {
    Geolocation.requestAuthorization(
      () => {
        setPermissionStatus(true);
      },
      () => {
        setPermissionStatus(false);
      },
    );
  };

  const startTracking = () => {
    // TODO: Implement tracking functionality
  };

  const saveWorkout = () => {
    // TODO: Implement save workout functionality
    // Navigate to the workout complete screen to show the summary
  };

  return (
    <SafeAreaView style={styles.container}>
      <MapView
        style={styles.map}
        showsUserLocation
        followsUserLocation
        showsMyLocationButton={false}
        showsCompass={false}
      />

      {!permissionStatus && <LocationPermissionPrompt />}

      <View style={{ position: 'absolute', bottom: 20, left: 20 }}>
        <Button title="Start Tracking" onPress={startTracking} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    height: deviceHeight,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default MapScreen;
