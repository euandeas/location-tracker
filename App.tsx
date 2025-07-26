import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MapScreen from './src/MapScreen.tsx';
import WorkoutComplete from './src/WorkoutComplete.tsx';
import { NavigationContainer } from '@react-navigation/native';
import { Activity } from './src/utils/Tracking';

const App = () => {
  return (
    <NavigationContainer>
      <Router />
    </NavigationContainer>
  );
};

type RootStackParamList = {
  Map: undefined;
  WorkoutComplete: { activity: Activity };
};

const Router = () => {
  const RootStack = createNativeStackNavigator<RootStackParamList>();

  return (
    <RootStack.Navigator>
      <RootStack.Screen
        name="Map"
        component={MapScreen}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="WorkoutComplete"
        component={WorkoutComplete}
        options={{ title: 'Workout Summary' }}
      />
    </RootStack.Navigator>
  );
};

export default App;
