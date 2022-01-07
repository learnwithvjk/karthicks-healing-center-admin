import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import VisitorsListingScreen from 'src/screens/visitors-screens/VisitorsListingScreen';

export default function VisitorsScreenNavigator() {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="VisitorListingScreen">
      <Stack.Screen
        name="VisitorListingScreen"
        component={VisitorsListingScreen}
      />
    </Stack.Navigator>
  );
}
