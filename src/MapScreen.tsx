import React, { useEffect, useState } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import MapView, { Polyline } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import Geolocation from '@react-native-community/geolocation';
import LocationPermissionPrompt from './ui/LocationPermissionPrompt';
import TrackingButtons from './ui/TrackingButtons';
import useLocationTracking from './utils/Tracking';

const deviceHeight = Dimensions.get('window').height;

const MapScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [permissionStatus, setPermissionStatus] = useState(true);
  const {
    trackingStatus,
    locationHistory,
    startTracking,
    pauseTracking,
    resumeTracking,
    stopTracking,
  } = useLocationTracking();

  useEffect(() => {
    Geolocation.setRNConfiguration({
      skipPermissionRequests: false,
      authorizationLevel: 'always',
    });

    // Request permissions on mount
    requestPermissions();
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

  const stopWorkout = () => {
    const activity = stopTracking();
    navigation.navigate('WorkoutComplete', { activity });
  };

  return (
    <SafeAreaView style={styles.container}>
      <MapView
        style={styles.map}
        showsUserLocation={true}
        followsUserLocation={true}
        showsMyLocationButton={false}
        showsCompass={false}
      >
        {locationHistory.map((segment, index) => {
          if (segment.length < 2) {
            return null;
          }

          const coordinates = segment.map((entry) => ({
            latitude: entry.coords.latitude,
            longitude: entry.coords.longitude,
          }));

          return (
            <Polyline
              key={index}
              coordinates={coordinates}
              strokeColor="blue"
              strokeWidth={3}
            />
          );
        })}
      </MapView>

      {!permissionStatus && <LocationPermissionPrompt />}

      <TrackingButtons
        trackingStatus={trackingStatus}
        start={startTracking}
        pause={pauseTracking}
        resume={resumeTracking}
        stop={stopWorkout}
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
