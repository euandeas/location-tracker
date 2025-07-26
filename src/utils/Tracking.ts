import { useState, useRef, useEffect } from 'react';
import Geolocation, { GeolocationResponse } from '@react-native-community/geolocation';

type TrackingStatus = 'Not Started' | 'Tracking' | 'Paused';

type Activity = {
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
  const [distance, setDistance] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const start = useRef<number>(0);
  const end = useRef<number>(0);

  const watchId = useRef<number | undefined>(undefined);

  useEffect(() => {
    trackingStatusRef.current = trackingStatus;
  }, [trackingStatus]);

  const newPosition = (position: GeolocationResponse) => {
    setLocationHistory((prevHistory) => {
      const newHistory = [...prevHistory];
      const currentPath = newHistory[newHistory.length - 1];
      const prevPosition = currentPath[currentPath.length - 1];

      currentPath.push(position);

      if (prevPosition !== undefined) {
        setDistance(
          (prevDistance) => prevDistance + distanceBetween(prevPosition, position),
        );
        setDuration(
          (prevDuration) => prevDuration + position.timestamp - prevPosition.timestamp,
        );
      }

      newHistory[newHistory.length - 1] = currentPath;
      return newHistory;
    });
  };

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

  const locationTracking = () => {
    if (!watchId.current) {
      watchId.current = Geolocation.watchPosition(
        (position) => {
          if (trackingStatusRef.current === 'Tracking') {
            newPosition(position);
          }
        },
        (error) => {
          console.error(error);
        },
        { enableHighAccuracy: true, timeout: 60000, maximumAge: 0, distanceFilter: 5 },
      );
    }
  };

  const startTracking = () => {
    setTrackingStatus('Tracking');
    start.current = new Date().getTime();
    locationTracking();
  };

  const pauseTracking = () => {
    // Small optimization to prevent unnecessary updates
    if (watchId.current) {
      Geolocation.clearWatch(watchId.current);
    }
    setLocationHistory((prevHistory) => [...prevHistory, []]);
    setTrackingStatus('Paused');
  };

  const resumeTracking = () => {
    locationTracking();
    setTrackingStatus('Tracking');
  };

  const stopTracking = () => {
    end.current = new Date().getTime();
    if (watchId.current) {
      Geolocation.clearWatch(watchId.current);
    }
    setTrackingStatus('Not Started');

    const activity: Activity = {
      start: start.current,
      end: end.current,
      duration,
      distance,
      locationHistory,
    };

    return activity;
  };

  return {
    trackingStatus,
    distance,
    duration,
    locationHistory,
    startTracking,
    pauseTracking,
    resumeTracking,
    stopTracking,
  };
};

export default useLocationTracking;
