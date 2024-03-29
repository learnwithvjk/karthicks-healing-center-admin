import React from 'react';
import HomeScreenNavigator from 'src/screens/home-screens/HomeScreenNavigator';
import TitleCard from 'src/components/TitleCard';
import {createDrawerNavigator} from '@react-navigation/drawer';
import BookingsScreenNavigator from 'src/screens/bookings-screens/BookingsScreenNavigator';
import VisitorsScreenNavigator from 'src/screens/visitors-screens/VisitorsScreenNavigator';
import ReachUs from 'src/screens/profile-screens/ReachUs.tsx';
import ManageSlots from 'src/screens/manage-slots/ManageSlots.tsx';
import {SelectedDateDetailsProvider} from 'src/contexts/DateDetailsContext';

export default function AdminMainScreenNavigator() {
  const Drawer = createDrawerNavigator();
  const ManageSlotsWithProvider = () => {
    return (
      <SelectedDateDetailsProvider>
        <ManageSlots />
      </SelectedDateDetailsProvider>
    );
  };
  return (
    <Drawer.Navigator
      // screenOptions={{
      //   headerTitle: () => <TitleCard />,
      // }}
      initialRouteName="HomeScreenNavigator">
      <Drawer.Screen
        options={{
          headerTitle: () => <TitleCard title="Home" />,
          title: 'Home',
        }}
        name="HomeScreenNavigator"
        component={HomeScreenNavigator}
      />
      <Drawer.Screen
        options={{
          headerTitle: () => <TitleCard title="Bookings" />,
          title: 'Bookings',
        }}
        name="BookingsScreenNavigator"
        component={BookingsScreenNavigator}
      />
      <Drawer.Screen
        options={{
          headerTitle: () => <TitleCard title="Visitors" />,
          title: 'Visitors',
        }}
        name="VisitorsScreenNavigator"
        component={VisitorsScreenNavigator}
      />
      <Drawer.Screen
        options={{
          headerTitle: () => <TitleCard title="Slot Details" />,
          title: 'Manage Slots',
        }}
        name="ManageSlots"
        component={ManageSlotsWithProvider}
      />
      <Drawer.Screen
        options={{
          headerTitle: () => <TitleCard title="Clinic Details" />,
          title: 'ReachUs',
        }}
        name="ReachUs"
        component={ReachUs}
      />
    </Drawer.Navigator>
  );
}
