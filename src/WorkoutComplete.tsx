import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Activity } from './utils/Tracking';
import { distanceFormat, durationFormat, speedFormat } from './utils/Formatting';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type RootStackParamList = {
  Map: undefined;
  WorkoutComplete: { activity: Activity };
};

type Props = NativeStackScreenProps<RootStackParamList, 'WorkoutComplete'>;

const WorkoutComplete = ({ route }: Props) => {
  const { activity } = route.params;

  const startTime = new Date(activity.start);
  const endTime = new Date(activity.end);

  return (
    <View style={styles.container}>
      <View style={styles.statBox}>
        <Text style={styles.label}>Date</Text>
        <Text style={styles.value}>{startTime.toLocaleDateString()}</Text>
      </View>

      <View style={styles.row}>
        <View style={styles.timeBox}>
          <Text style={styles.label}>Start</Text>
          <Text style={styles.value}>{startTime.toLocaleTimeString()}</Text>
        </View>
        <View style={styles.timeBox}>
          <Text style={styles.label}>End</Text>
          <Text style={styles.value}>{endTime.toLocaleTimeString()}</Text>
        </View>
      </View>

      <View style={styles.statBox}>
        <Text style={styles.label}>Distance</Text>
        <Text style={styles.value}>{distanceFormat(activity.distance)}</Text>
      </View>

      <View style={styles.statBox}>
        <Text style={styles.label}>Average Speed</Text>
        <Text style={styles.value}>
          {speedFormat(activity.distance / (activity.duration / 1000))}
        </Text>
      </View>

      <View style={styles.statBox}>
        <Text style={styles.label}>Moving Time</Text>
        <Text style={styles.value}>{durationFormat(activity.duration)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  timeBox: {
    flex: 1,
  },
  statBox: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#888',
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 4,
  },
});

export default WorkoutComplete;
