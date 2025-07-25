import React from 'react';
import { View, StyleSheet } from 'react-native';
import LargeButton from '../components/LargeButton.tsx';

type TrackingButtonsProp = {
  trackingStatus: string;
  start: () => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
};

const TrackingButtons = ({
  trackingStatus,
  start,
  pause,
  resume,
  stop,
}: TrackingButtonsProp) => {
  return (
    <View style={styles.buttonWrapper}>
      {trackingStatus === 'Not Started' && <LargeButton title="Start" onPress={start} />}
      {trackingStatus === 'Tracking' && <LargeButton title="Pause" onPress={pause} />}
      {trackingStatus === 'Paused' && (
        <View style={styles.pausedButtonsWrapper}>
          <LargeButton
            buttonStyle={styles.resumeButton}
            title="Resume"
            onPress={resume}
          />
          <LargeButton buttonStyle={styles.stopButton} title="Stop" onPress={stop} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  buttonWrapper: {
    position: 'absolute',
    bottom: 25,
    left: 20,
    right: 20,
    paddingHorizontal: 0,
  },
  pausedButtonsWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  resumeButton: {
    width: '48%',
  },
  stopButton: {
    width: '48%',
    backgroundColor: '#343534',
  },
});

export default TrackingButtons;
