import React, { StrictMode } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MapScreen from './src/MapScreen.tsx';
import WorkoutComplete from './src/WorkoutComplete.tsx';
import { NavigationContainer } from '@react-navigation/native';

const App = () => {
  return (
    <NavigationContainer>
      <Router />
    </NavigationContainer>
  );
};

const Router = () => {
  const RootStack = createNativeStackNavigator();

  return (
    <RootStack.Navigator>
      <RootStack.Screen
        name="Map"
        component={MapScreen}
        options={{ headerShown: false }}
      />
      <RootStack.Screen name="WorkoutComplete" component={WorkoutComplete} />
    </RootStack.Navigator>
  );
};

export default App;
