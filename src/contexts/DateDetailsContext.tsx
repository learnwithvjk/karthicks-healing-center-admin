import React, {useState} from 'react';
import {
  getSlotDateDetails,
  getDefaultTimeDetails,
  updateDefaultTimeDetails,
  updateSlotDateDetails,
  addSelectedDateDetails,
} from 'src/api/Slots';
import auth from '@react-native-firebase/auth';

export const SelectedDateContext = React.createContext({
  selectedDateDetails: [] as Array<string>,
  defaultTimings: undefined as unknown as any,
  isSelectedDateDetailsLoading: false,
  initializeSelectedDateDetails: (date: string) => {
    console.log('initializeSelectedDateDetails dummy method called');
  },
  initializeDefaultTimeDetails: () => {
    console.log('initializeDefaultTimeDetails dummy method called');
  },
  updateDateFieldContext: (updatedObj: any) => {
    console.log('updateDateFieldContext dummy method called');
  },
  updateDefaultTimeDetails: (updatedObj: any) => {
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

const getDefaultTimeDetailsFromAPI = async () => {
  const payload = {
    queryParams: {
      uid: auth().currentUser?.uid,
    },
  };
  return await getDefaultTimeDetails(payload);
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

const updateDefaultTimeDetailsFromAPI = async (updatedValues: any) => {
  const payload = {
    bodyParams: {
      uid: auth().currentUser?.uid,
      ...updatedValues,
    },
  };
  console.log(JSON.stringify(payload));
  return await updateDefaultTimeDetails(payload);
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
  const [defaultTimings, setDefaultTimings] = useState(undefined as any);
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

  const initializeDefaultTimeDetails = async () => {
    console.log('actual method called');
    setIsSelectedDateDetailsLoading(true);
    try {
      const defaultTimeDetails = await getDefaultTimeDetailsFromAPI();
      console.log('defaultTimeDetails set');
      console.log(defaultTimeDetails);
      setDefaultTimings(defaultTimeDetails);
      return defaultTimeDetails;
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

  const updateDefaultTimeDetails = async (updateDefaultTimeDetailsObj: any) => {
    console.log('actual method called');
    setIsSelectedDateDetailsLoading(true);
    try {
      await updateDefaultTimeDetailsFromAPI(updateDefaultTimeDetailsObj);
      console.log('defaultTimings updated');
      console.log(selectedDateDetails);
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
        defaultTimings,
        isSelectedDateDetailsLoading,
        updateDateFieldContext,
        updateDefaultTimeDetails,
        initializeDefaultTimeDetails,
        initializeSelectedDateDetails,
        addNewDateField,
      }}>
      {children}
    </SelectedDateContext.Provider>
  );
};
