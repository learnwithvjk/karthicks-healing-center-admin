import {firebase} from '@react-native-firebase/database'; // import {firebase} from '@react-native-firebase/firestore';
import {commonErrorHandler} from 'src/error-handling/commonErrorHanlders';

const fireBaseInstance = firebase
  .app()
  .database(
    'https://karthik-s-healing-centre-default-rtdb.asia-southeast1.firebasedatabase.app',
  );

export async function getStatus(setValue: Function) {
  try {
    fireBaseInstance.ref('is_available').on('value', (snapshot: any) => {
      setValue(!!snapshot.val());
      console.log('is-available-updated');
    });
  } catch (error) {
    commonErrorHandler(error);
  }
}

export async function setStatus(value: any) {
  try {
    fireBaseInstance
      .ref('is_available')
      .set(value ? 1 : 0)
      .then(() => console.log('Data set.'));
  } catch (error) {
    commonErrorHandler(error);
  }
}

export async function getBannerMessage(setValue: Function) {
  try {
    fireBaseInstance.ref('banner_message').on('value', (snapshot: any) => {
      setValue(snapshot.val());
      console.log('banner_message-updated');
    });
  } catch (error) {
    commonErrorHandler(error);
  }
}

export async function setBannerMessageRealTime(value: any) {
  try {
    fireBaseInstance
      .ref('banner_message')
      .set(value)
      .then(() => console.log('Data set.'));
  } catch (error) {
    commonErrorHandler(error);
  }
}
