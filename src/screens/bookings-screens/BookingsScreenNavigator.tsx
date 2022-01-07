import React from 'react';
import HomeScreen from 'src/screens/home-screens/HomeScreen';
import {createStackNavigator} from '@react-navigation/stack';
import EditSliderImages from 'src/screens/home-screens/EditSliderImages';
import BookingListingScreen from 'src/screens/bookings-screens/BookingListingScreen';

export default function BookingsScreenNavigator() {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="BookingListingScreen">
      <Stack.Screen
        name="BookingListingScreen"
        component={BookingListingScreen}
      />
    </Stack.Navigator>
  );
}
