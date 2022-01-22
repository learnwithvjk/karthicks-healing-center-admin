import React, {useContext, useState} from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {globalStyles} from 'src/styles/global';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';

import Spinner from 'react-native-loading-spinner-overlay';
import {
  SelectedDateContext,
  SelectedDateDetailsProvider,
} from 'src/contexts/DateDetailsContext';
import {commonErrorHandler} from 'src/error-handling/commonErrorHanlders';
import {ScrollView, Switch, TextInput} from 'react-native-gesture-handler';
import RadioButtonGroup from 'src/components/RadioButtonGroup';

interface ManageSlotsProps {}

const ManageSlots: React.FC<ManageSlotsProps> = ({}) => {
  const selectedDateContext = useContext(SelectedDateContext);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isThisDayHoliday, setIsThisDayHoliday] = useState(false);

  const [dateType, setDateType] = useState('e');

  const [timings, setTimings] = useState([]);
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };
  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const [selectedDate, setSelectedDate] = useState(
    undefined as unknown as String,
  );
  const [tempDate, setTempdDate] = useState(undefined as unknown as Date);
  const handleConfirm = async (date: Date) => {
    try {
      const newDate = moment(date.toISOString()).format('MM/DD/YYYY');
      console.log(newDate);
      setSelectedDate(newDate);
      setTempdDate(date);
      if (dateType === 'e') {
        const selectedDateObj =
          await selectedDateContext.initializeSelectedDateDetails(
            date.toISOString(),
          );
        console.log(selectedDateObj);
        //   const selectedDateObj = JSON.parse(
        //     JSON.stringify(selectedDateContext.selectedDateDetails),
        //   );

        setIsThisDayHoliday(selectedDateObj.is_holiday);
        setTimings(selectedDateObj.timings);
      }

      hideDatePicker();
    } catch (err) {
      commonErrorHandler(err);
      console.log('error on date picker selection');
      console.log(err);
    }
  };

  function handleTimiChange(index: number, value: string) {
    if (isNaN(Number(value))) {
      console.log('inside');
      commonErrorHandler(
        `kindly input a number for ${timings[index].slot_time}`,
      );
      return;
    }
    setTimings(previousData => {
      const dataToEditpreviousData = previousData[index];

      previousData = previousData.filter(timingSlot => {
        if (timingSlot.slot_time === dataToEditpreviousData.slot_time) {
          timingSlot.available_count = Number(value);
        }
        return timingSlot;
      });

      return previousData;
    });
  }

  function toggleSwitch() {
    setIsThisDayHoliday(!isThisDayHoliday);
  }

  const TimingSlot = ({item, index}: any) => {
    // console.log(item);
    return (
      <View style={styles.timeWrapper}>
        <Text style={styles.slotTimeText}> {item.slot_time}</Text>
        <TextInput
          style={[globalStyles.input, styles.timingInput]}
          multiline
          keyboardType="numeric"
          placeholderTextColor="grey"
          onChangeText={value => handleTimiChange(index, value)}
          value={item.available_count.toString()}
        />
      </View>
    );
  };

  async function updateDateInfo() {
    try {
      const updatedDateFieldObj = {
        date: tempDate.toDateString().toString(),
        is_holiday: isThisDayHoliday,
        timings: timings,
      };
      await selectedDateContext.updateDateFieldContext(updatedDateFieldObj);
      Alert.alert('Date Configuration updated', undefined, [{text: 'OK'}]);
    } catch (err) {
      commonErrorHandler(err);
    }
  }

  async function addDateInfo() {
    try {
      const selectedDateObj = await selectedDateContext.addNewDateField(
        tempDate.toDateString(),
      );
      setIsThisDayHoliday(selectedDateObj.is_holiday);
      setTimings(selectedDateObj.timings);
      setDateType('e');
      Alert.alert('Date added scuccessfully', undefined, [{text: 'OK'}]);
    } catch (err) {
      commonErrorHandler(err);
    }
  }

  async function handleSubmit() {
    if (dateType === 'e') {
      await updateDateInfo();
    } else {
      await addDateInfo();
    }
  }

  return (
    <SelectedDateDetailsProvider>
      <Spinner
        visible={selectedDateContext.isSelectedDateDetailsLoading}
        textContent={'Loading...'}
        textStyle={styles.spinnerTextStyle}
        cancelable
      />
      <View style={styles.manageSlotsWrapper}>
        <ScrollView style={styles.infoSection}>
          <View style={styles.DateSelectWrapper}>
            <RadioButtonGroup
              options={[
                {
                  label: 'Add Date',
                  optionKey: 'a',
                  color: dateType === 'a' ? '#ff0000' : undefined,
                },
                {
                  label: 'Edit Date',
                  optionKey: 'e',
                  color: dateType === 'e' ? '#ff0000' : undefined,
                },
              ]}
              value={dateType}
              onChange={setDateType}
            />
          </View>
          <View style={styles.DateSelectWrapper}>
            <Text style={styles.DateSelectTitle}> Select a Date </Text>
            <View>
              <TouchableWithoutFeedback onPress={showDatePicker}>
                <Text
                  style={[
                    globalStyles.input,
                    selectedDate ? styles.dateSelectedText : styles.placeHolder,
                  ]}>
                  {selectedDate
                    ? `${selectedDate}`
                    : 'Pick a date to get details'}
                </Text>
              </TouchableWithoutFeedback>
              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                date={tempDate}
                onConfirm={(newDate: Date) => handleConfirm(newDate)}
                onCancel={hideDatePicker}
              />
            </View>
          </View>
          {dateType === 'e' && selectedDateContext.selectedDateDetails && (
            <View>
              <View style={styles.currentStatusWrapper}>
                {!isThisDayHoliday && (
                  <View style={styles.statusWrapper}>
                    {/* <View style={styles.greenCircle} /> */}
                    <Text style={styles.checkedOutStatus}>
                      This Day is not an Holiday
                    </Text>
                  </View>
                )}
                {isThisDayHoliday && (
                  <View style={styles.statusWrapper}>
                    {/* <View style={styles.greyCircle} /> */}
                    <Text style={styles.checkedOutStatus}>
                      This Day is an Holiday
                    </Text>
                  </View>
                )}
                <View style={styles.rhs}>
                  <Switch
                    trackColor={{false: 'grey', true: 'blue'}}
                    thumbColor={'#f4f3f4'}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={toggleSwitch}
                    value={isThisDayHoliday}
                  />
                </View>
              </View>

              <View style={styles.currentStatusWrapper}>
                {timings && (
                  <View>
                    <Text style={styles.checkedOutStatus}>
                      Modify Timings:{' '}
                    </Text>
                    <ScrollView>
                      {timings.map((timingSlot, index) => (
                        <TimingSlot
                          key={timingSlot.slot_time}
                          item={timingSlot}
                          index={index}
                        />
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>
            </View>
          )}
        </ScrollView>
        <View style={styles.saveButtonWrapper}>
          {selectedDate && (
            <TouchableOpacity
              onPress={() => {
                handleSubmit();
              }}
              style={styles.addNewButtonWrapper}>
              {dateType === 'e' && (
                <Text style={styles.addNewLabel}>save configuration </Text>
              )}
              {dateType === 'a' && (
                <Text style={styles.addNewLabel}>add date</Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SelectedDateDetailsProvider>
  );
};

const styles = StyleSheet.create({
  DateSelectWrapper: {
    margin: 10,
    backgroundColor: '#fff',
    padding: 10,
    display: 'flex',
    flexDirection: 'column',
  },
  DateSelectTitle: {
    color: '#000',
    fontWeight: '500',
    fontSize: 16,
  },
  dateSelectedText: {
    color: '#000',
  },
  placeHolder: {
    color: 'grey',
  },
  currentStatusWrapper: {
    backgroundColor: '#fff',
    margin: 10,
    elevation: 5,
    borderRadius: 5,
    padding: 10,
    display: 'flex',
    flexDirection: 'row',
  },
  statusWrapper: {
    display: 'flex',
    color: '#FF0000',
    fontWeight: '500',
    fontSize: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkedOutStatus: {
    color: '#444',
    fontSize: 16,
    fontWeight: '500',
  },
  rhs: {
    width: '10%',
    marginLeft: 'auto',
  },
  timeWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
  },
  slotTimeText: {
    color: '#000',
    fontWeight: '500',
  },
  timingInput: {
    width: '50%',
    marginLeft: 'auto',
  },
  manageSlotsWrapper: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  infoSection: {
    height: '65%',
  },
  saveButtonWrapper: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-around',
    // marginBottom: 10,
  },
  addNewButtonWrapper: {
    backgroundColor: '#00790D',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    width: '70%',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addNewLabel: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '600',
  },
});

export default ManageSlots;
