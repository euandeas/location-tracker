import React, { useEffect, useState } from 'react';
import { StyleSheet, Dimensions, View, Text, Platform } from 'react-native';
import MapView, { Polyline } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import Geolocation from '@react-native-community/geolocation';
import LocationPermissionPrompt from './ui/LocationPermissionPrompt';
import TrackingButtons from './ui/TrackingButtons';
import useLocationTracking from './utils/Tracking';
import { distanceFormat, speedFormat } from './utils/Formatting';

const deviceHeight = Dimensions.get('window').height;

const MapScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [permissionStatus, setPermissionStatus] = useState(false);
  const {
    region,
    trackingStatus,
    distance,
    stopwatch,
    speed,
    locationHistory,
    startTracking,
    pauseTracking,
    resumeTracking,
    stopTracking,
  } = useLocationTracking();

  let defRegion = {
    latitude: 51.478792,
    longitude: -0.156603,
  };

  useEffect(() => {
    // Request permissions on mount
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    Geolocation.requestAuthorization(
      () => {
        setPermissionStatus(true);
      },
      () => {
        setPermissionStatus(false);
      },
    );
  };

  // Stop tracking and then pass activity details to WorkoutComplete screen
  const stopWorkout = async () => {
    const activity = await stopTracking();
    navigation.navigate('WorkoutComplete', { activity });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Distance</Text>
          <Text style={styles.statValue}>{distanceFormat(distance)}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Split</Text>
          <Text style={styles.statValue}>{speedFormat(speed)}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Time</Text>
          <Text style={styles.statValue}>
            {stopwatch.minutes.toString().padStart(2, '0')}:
            {stopwatch.seconds.toString().padStart(2, '0')}
          </Text>
        </View>
      </View>

      <MapView
        style={styles.map}
        // Bug in react-native-maps on Android means this doesn't always work
        showsUserLocation
        // IOS only
        followsUserLocation
        showsMyLocationButton={false}
        showsCompass={false}
        // Following user location on android
        region={
          Platform.OS === 'android'
            ? {
                latitude: region ? region.latitude : defRegion.latitude,
                longitude: region ? region.longitude : defRegion.longitude,
                latitudeDelta: 0.015,
                longitudeDelta: 0.015,
              }
            : undefined
        }
      >
        {locationHistory.map((segment, index) => {
          // Displays route on map, handling pauses.
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
              strokeWidth={4}
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
  statsContainer: {
    position: 'absolute',
    top: 40,
    left: 20,
    right: 20,
    backgroundColor: '#343534',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    zIndex: 10,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 16,
    color: '#fff',
  },
  statValue: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default MapScreen;
