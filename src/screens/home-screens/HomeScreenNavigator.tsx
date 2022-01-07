import React from 'react';
import HomeScreen from 'src/screens/home-screens/HomeScreen';
import {createStackNavigator} from '@react-navigation/stack';
import EditSliderImages from 'src/screens/home-screens/EditSliderImages';
import EditYoutubeVideos from 'src/screens/home-screens/EditYoutubeVideos';
import {SliderImagesProvider} from 'src/contexts/SliderImagesContext';
export default function HomeScreenNavigator() {
  const Stack = createStackNavigator();
  return (
    <SliderImagesProvider>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName="HomeScreen">
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen
          name="EditSliderImages"
          options={{
            animationEnabled: false,
          }}
          component={EditSliderImages}
        />
      </Stack.Navigator>
    </SliderImagesProvider>
  );
}
