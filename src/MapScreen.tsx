import React, { useEffect, useState } from 'react';
import { StyleSheet, Dimensions, AppState } from 'react-native';
import MapView from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import Geolocation from '@react-native-community/geolocation';
import LocationPermissionPrompt from './ui/LocationPermissionPrompt';
import TrackingButtons from './ui/TrackingButtons';

const deviceHeight = Dimensions.get('window').height;

Geolocation.setRNConfiguration({
  skipPermissionRequests: false,
  authorizationLevel: 'whenInUse',
});

type TrackingStatus = 'Not Started' | 'Tracking' | 'Paused';

const MapScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [permissionStatus, setPermissionStatus] = useState(true);
  const [trackingStatus, setTrackingStatus] = useState<TrackingStatus>('Not Started');
  let watchId: number | undefined;

  useEffect(() => {
    // Request permissions on mount
    requestPermissions();

    // When app comes back into focus, check permissions again
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

  const locationTracking = () => {
    if (!watchId) {
      watchId = Geolocation.watchPosition(
        (position) => {
          console.log(position);
        },
        (error) => {
          console.error(error);
        },
        { enableHighAccuracy: true, timeout: 60000, maximumAge: 0, distanceFilter: 5 },
      );
    }
  };

  const startTracking = () => {
    locationTracking();
    setTrackingStatus('Tracking');
  };

  const pauseTracking = () => {
    if (watchId) {
      Geolocation.clearWatch(watchId);
    }
    setTrackingStatus('Paused');
  };

  const resumeTracking = () => {
    locationTracking();
    setTrackingStatus('Tracking');
  };

  const saveWorkout = () => {
    // Navigate to the workout complete screen to show the summary
    navigation.navigate('WorkoutComplete');
    setTrackingStatus('Not Started');
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

      <TrackingButtons
        trackingStatus={trackingStatus}
        start={startTracking}
        pause={pauseTracking}
        resume={resumeTracking}
        stop={saveWorkout}
      />
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
