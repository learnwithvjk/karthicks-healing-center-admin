/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {useState, useEffect, useRef} from 'react';
import {SafeAreaView, Animated, StyleSheet, Easing, Alert} from 'react-native';
import RNExitApp from 'react-native-exit-app';
import {commonErrorHandler} from 'src/error-handling/commonErrorHanlders';
import PyramidLoadingSplash from 'src/screens/splash-screens/PyramidLoadingSplash';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import AdminMainScreenNavigator from 'src/screens/AdminMainScreenNavigator';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import auth from '@react-native-firebase/auth';
import ReachUs from 'src/screens/profile-screens/ReachUs';
import VisitorForm from 'src/forms/VisitorForm';
import BookingForm from 'src/forms/BookingForm';
import {UserContext} from 'src/contexts/Context';
// Must be outside of any component LifeCycle (such as `componentDidMount`).
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {checkIfUserIsAdmin} from 'src/api/Auth';
import 'react-native-gesture-handler';
const App = () => {
  const backgroundStyle = {
    backgroundColor: '#fff',
    flex: 1,
  };
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const maninScreenOpacity = useRef(new Animated.Value(0)).current;
  const splashScreenOpacity = useRef(new Animated.Value(1)).current;
  const fadeIn = () => {
    Animated.sequence([
      Animated.timing(splashScreenOpacity, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(maninScreenOpacity, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
        easing: Easing.inOut(Easing.ease),
      }),
    ]).start(() => {
      // setIsSplashLoaded(prevValue => !prevValue);
    });
  };

  const [isSignInHandled, setIsSignInHandled] = useState(false);
  const [uidStr, setUidStr] = useState(auth().currentUser?.uid);

  useEffect(() => {
    console.log('App.tsx mounted');
  }, []);

  useEffect(() => {
    console.log('auth().currentUser?.email' + auth().currentUser?.email);
    console.log('handling signIn process');
    GoogleSignin.configure({
      webClientId:
        '497103294924-aprhbval5tlbf3ffqs3426qjntq771vg.apps.googleusercontent.com',
    });
    if (auth().currentUser?.uid) {
      console.log('auth().currentUser?.uid' + auth().currentUser?.uid);

      const payload = {
        queryParams: {
          uid: auth().currentUser?.uid,
        },
      };
      checkIfUserIsAdmin(payload)
        .then(() => {
          console.log('admin is already signed in');
          setIsLoading(false);
        })
        .catch(async error => {
          console.log('signed in user is not an admin');

          if (await GoogleSignin.isSignedIn()) {
            await GoogleSignin.revokeAccess();
            await GoogleSignin.signOut();
          }
          if (auth().currentUser?.uid) {
            auth().signOut();
          }
          console.log('user signed out');
          commonErrorHandler(error, RNExitApp.exitApp);
        });
    } else {
      console.log('going to sign in');
      GoogleSignin.signIn()
        .then((googleAccountInfo: any) => {
          console.log('googleAccountInfo' + googleAccountInfo?.idToken);
          const googleCredential = auth.GoogleAuthProvider.credential(
            googleAccountInfo?.idToken,
          );
          auth()
            .signInWithCredential(googleCredential)
            .then(async userInfo => {
              console.log('auth().currentUser?.uid' + auth().currentUser?.uid);
              console.log('signed in successfully');
              const payload = {
                queryParams: {
                  uid: auth().currentUser?.uid,
                },
              };
              checkIfUserIsAdmin(payload)
                .then(() => {
                  setUidStr(userInfo.user.uid);
                  console.log('uidStr:' + uidStr);
                  console.log('ADMIN signed in');
                  setIsLoading(false);
                })
                .catch(async error => {
                  if (await GoogleSignin.isSignedIn()) {
                    await GoogleSignin.revokeAccess();
                    await GoogleSignin.signOut();
                  }
                  if (auth().currentUser?.uid) {
                    auth().signOut();
                  }
                  console.log('user signed out');
                  commonErrorHandler(error, RNExitApp.exitApp);
                });
            });
        })
        .catch((error: any) => {
          console.log('error occured wile sing in' + error.code);
          setIsError(true);
          commonErrorHandler(error, RNExitApp.exitApp);
        });
    }
    return () => {
      console.log('sign in process Complete:');
      setIsSignInHandled(true);
    };
  }, [isSignInHandled, uidStr]);

  const Stack = createStackNavigator();

  const AppScreenNavigator = () => (
    <UserContext.Provider value={uidStr}>
      <Stack.Navigator
      // screenOptions={{
      //   presentation: 'modal',
      // }}
      >
        <Stack.Screen
          options={{
            headerShown: false,
          }}
          name="MainScreen"
          component={AdminMainScreenNavigator}
        />
        <Stack.Screen
          options={{
            headerShown: false,
            presentation: 'modal',
            animation: 'slide_from_bottom',
          }}
          name="BookingFormModal"
          component={BookingForm}
        />
        <Stack.Screen
          options={{
            headerShown: false,
            presentation: 'modal',
            animation: 'slide_from_bottom',
          }}
          name="VisitorFormModal"
          component={VisitorForm}
        />

        <Stack.Screen
          options={{
            title: 'Reach us',
            headerLargeTitle: true,
            headerTintColor: '#00790D',
            headerTitleStyle: {
              color: '#00790D',
            },
          }}
          name="ReachUs"
          component={ReachUs}
        />
      </Stack.Navigator>
    </UserContext.Provider>
  );

  return (
    <NavigationContainer>
      <SafeAreaProvider>
        <SafeAreaView style={backgroundStyle}>
          <Animated.View
            style={[styles.splashScreenView, {opacity: splashScreenOpacity}]}>
            <PyramidLoadingSplash
              isError={isError}
              isLoading={isLoading}
              postSplashAction={() => {
                fadeIn();
              }}
            />
          </Animated.View>

          {/* <AdminMainScreenNavigator /> */}
          {!isLoading && (
            <Animated.View
              style={[styles.mainScreenView, {opacity: maninScreenOpacity}]}>
              <AppScreenNavigator />
            </Animated.View>
          )}
        </SafeAreaView>
      </SafeAreaProvider>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  splashScreenView: {
    flex: 1,
    position: 'absolute',
  },
  mainScreenView: {
    flex: 1,
  },
});

export default App;
