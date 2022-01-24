/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import PushNotification from 'react-native-push-notification';

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
