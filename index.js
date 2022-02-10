/**
 * @format
 */

 import {AppRegistry} from 'react-native';
 import App from './App';
 import {name as appName} from './app.json';
 import PushNotification from 'react-native-push-notification';
 import messaging from '@react-native-firebase/messaging';
 
 
 messaging().setBackgroundMessageHandler(async remoteMessage => {
   console.log('Message handled in the background!', remoteMessage);
 });
 messaging()
   .subscribeToTopic('test')
   .then(() => console.log('Subscribed to topic!'));
   
 PushNotification.configure({
   // (optional) Called when Token is generated (iOS and Android)
   onRegister: function (token) {
     console.log('TOKEN:', token);
   },
 
   // (required) Called when a remote is received or opened, or local notification is opened
   onNotification: function (notification) {
     //handleNotification(notification);
     PushNotification.localNotification(notification);
     console.log('NOTIFICATION:', notification);
   },
   onRegistrationError: function(err) {
     console.error(err.message, err);
   },
   
 });
 // messaging().onMessage(async remoteMessage => {
 //   PushNotification.localNotification({
 //     message: remoteMessage.notification.body,
 //     title: remoteMessage.notification.title,
 //     // bigPictureUrl: remoteMessage.notification.android.imageUrl,
 //     // smallIcon: remoteMessage.notification.android.imageUrl,
 //   });
 // });
 AppRegistry.registerComponent(appName, () => App);
 