import { useState, useRef, useEffect } from 'react';
import Geolocation, { GeolocationResponse } from '@react-native-community/geolocation';
import { useStopwatch } from 'react-timer-hook';

type TrackingStatus = 'Not Started' | 'Tracking' | 'Paused';

export type Activity = {
  start: number;
  end: number;
  duration: number;
  distance: number;
  locationHistory: GeolocationResponse[][];
};

const useLocationTracking = () => {
  // Used by tracking buttons to react to changes in tracking status
  const [trackingStatus, setTrackingStatus] = useState<TrackingStatus>('Not Started');
  // Used by geolocation callback to update tracking status
  const trackingStatusRef = useRef<TrackingStatus>('Not Started');

  const [locationHistory, setLocationHistory] = useState<GeolocationResponse[][]>([[]]);
  const [region, setRegion] = useState<GeolocationResponse['coords']>();
  const [distance, setDistance] = useState<number>(0);
  const [speed, setSpeed] = useState<number>(0);
  const start = useRef<number>(0);
  const stopwatch = useStopwatch({ autoStart: false });

  const watchId = useRef<number | undefined>(undefined);

  useEffect(() => {
    trackingStatusRef.current = trackingStatus;
  }, [trackingStatus]);

  // Handles position updates - add to history, calculate distance and set speed
  const newPosition = async (position: GeolocationResponse) => {
    setLocationHistory((prevHistory) => {
      const newHistory = [...prevHistory];
      const currentPath = newHistory[newHistory.length - 1];
      const prevPosition = currentPath[currentPath.length - 1];

      currentPath.push(position);

      if (prevPosition !== undefined) {
        setDistance(
          (prevDistance) => prevDistance + distanceBetween(prevPosition, position),
        );
      }

      setSpeed(position.coords.speed || 0);

      newHistory[newHistory.length - 1] = currentPath;
      return newHistory;
    });
  };

  // Calculates distance between two points on the Earth's surface using the Haversine formula
  const distanceBetween = (
    prevPosition: GeolocationResponse,
    position: GeolocationResponse,
  ) => {
    const R = 6371e3;
    const φ1 = (prevPosition.coords.latitude * Math.PI) / 180;
    const φ2 = (position.coords.latitude * Math.PI) / 180;
    const Δφ =
      ((position.coords.latitude - prevPosition.coords.latitude) * Math.PI) / 180;
    const Δλ =
      ((position.coords.longitude - prevPosition.coords.longitude) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const d = R * c;
    return d;
  };

  // Starts watching GPS location changes
  const locationTracking = async () => {
    watchId.current = Geolocation.watchPosition(
      (position) => {
        setRegion(position.coords);
        if (trackingStatusRef.current === 'Tracking') {
          newPosition(position);
        }
      },
      (error) => {
        console.error(error);
      },
      { enableHighAccuracy: true, timeout: 60000, maximumAge: 0, distanceFilter: 5 },
    );
  };

  // Starts workout tracking
  const startTracking = async () => {
    setTrackingStatus('Tracking');
    start.current = new Date().getTime();
    stopwatch.start();
    locationTracking();
  };

  // Pauses workout tracking
  const pauseTracking = async () => {
    // Small optimization to prevent unnecessary updates
    if (watchId.current) {
      Geolocation.clearWatch(watchId.current);
    }
    stopwatch.pause();
    // create new "segment" for after pause
    setLocationHistory((prevHistory) => [...prevHistory, []]);
    setTrackingStatus('Paused');
  };

  const resumeTracking = async () => {
    locationTracking();
    setTrackingStatus('Tracking');
    stopwatch.start();
  };

  // Stop tracking, return activity data and reset tracking details
  const stopTracking = async () => {
    stopwatch.pause();
    if (watchId.current) {
      Geolocation.clearWatch(watchId.current);
    }

    const activity: Activity = {
      start: start.current,
      end: new Date().getTime(),
      duration: stopwatch.totalMilliseconds,
      distance,
      locationHistory,
    };

    resetTracking();

    return activity;
  };

  // Reset tracking details
  const resetTracking = async () => {
    setTrackingStatus('Not Started');
    setLocationHistory([[]]);
    setDistance(0);
    setSpeed(0);
    start.current = 0;
    stopwatch.reset(undefined, false);
  };

  return {
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
  };
};

export default useLocationTracking;
