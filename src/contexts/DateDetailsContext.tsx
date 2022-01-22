import React, {useState} from 'react';
import {
  getSlotDateDetails,
  updateSlotDateDetails,
  addSelectedDateDetails,
} from 'src/api/Slots';
import auth from '@react-native-firebase/auth';

export const SelectedDateContext = React.createContext({
  selectedDateDetails: [] as Array<string>,
  isSelectedDateDetailsLoading: false,
  initializeSelectedDateDetails: (date: string) => {
    console.log('initializeSelectedDateDetails dummy method called');
  },
  updateDateFieldContext: (updatedObj: any) => {
    console.log('updateDateFieldContext dummy method called');
  },
  addNewDateField: (date: any) => {
    console.log('addNewDateField dummy method called');
  },
});

const getSelectedDateDetailsFromAPI = async (selectedDate: string) => {
  const payload = {
    queryParams: {
      uid: auth().currentUser?.uid,
      date: new Date(selectedDate).toDateString().toString(),
    },
  };
  return await getSlotDateDetails(payload);
};

const updateDateFieldContextFromAPI = async (updatedValues: any) => {
  const payload = {
    bodyParams: {
      uid: auth().currentUser?.uid,
      ...updatedValues,
    },
  };
  console.log(JSON.stringify(payload));
  return await updateSlotDateDetails(payload);
};

const addSelectedDateDetailsFromAPI = async (selectedDate: string) => {
  const payload = {
    queryParams: {
      uid: auth().currentUser?.uid,
      date: new Date(selectedDate).toDateString().toString(),
    },
  };
  return await addSelectedDateDetails(payload);
};

export const SelectedDateDetailsProvider = ({children}: any) => {
  const [selectedDateDetails, setselectedDateDetails] = useState(
    undefined as any,
  );
  const [isSelectedDateDetailsLoading, setIsSelectedDateDetailsLoading] =
    useState<boolean>(false);

  const initializeSelectedDateDetails = async (selectedDate: string) => {
    console.log('actual method called');
    setIsSelectedDateDetailsLoading(true);
    try {
      const selectedDateDetails = await getSelectedDateDetailsFromAPI(
        selectedDate,
      );
      console.log('selectedDateDetails set');
      console.log(selectedDateDetails);
      setselectedDateDetails(selectedDateDetails);
      return selectedDateDetails;
    } catch (err) {
      throw err;
    } finally {
      setIsSelectedDateDetailsLoading(false);
    }
  };

  const updateDateFieldContext = async (updatedselectedDateDetails: any) => {
    console.log('actual method called');
    setIsSelectedDateDetailsLoading(true);
    try {
      await updateDateFieldContextFromAPI(updatedselectedDateDetails);
      console.log('selectedDateDetails updated');
      console.log(selectedDateDetails);
      //  setselectedDateDetails(selectedDateDetails);
      return selectedDateDetails;
    } catch (err) {
      throw err;
    } finally {
      setIsSelectedDateDetailsLoading(false);
    }
  };

  const addNewDateField = async (selectedDate: string) => {
    console.log('actual method called');
    setIsSelectedDateDetailsLoading(true);
    try {
      const selectedDateDetails = await addSelectedDateDetailsFromAPI(
        selectedDate,
      );
      console.log('selectedDateDetails added');
      console.log(selectedDateDetails);
      setselectedDateDetails(selectedDateDetails);
      return selectedDateDetails;
    } catch (err) {
      throw err;
    } finally {
      setIsSelectedDateDetailsLoading(false);
    }
  };

  return (
    <SelectedDateContext.Provider
      value={{
        selectedDateDetails,
        isSelectedDateDetailsLoading,
        updateDateFieldContext,
        initializeSelectedDateDetails,
        addNewDateField,
      }}>
      {children}
    </SelectedDateContext.Provider>
  );
};
