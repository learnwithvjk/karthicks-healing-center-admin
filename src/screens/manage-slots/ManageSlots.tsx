import React, {useContext, useState} from 'react';
import {
  ActivityIndicator,
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
  const [stopBooking, setStopBooking] = useState(false);
  const [isNewTimeSlotLoaing, setNewTimeSlotLoaing] = useState(false);
  const [newTiming, setNewTiming] = useState('');
  const [defaultTimings, setDefaultTimings] = useState(undefined);
  const [defaultAvailableTime, setDefaultAvailableTimeCount] =
    useState(undefined);
  const [defaultTimingNames, setdefaultTimingNames] = useState(undefined);

  const [dateType, setDateType] = useState('e');
  const [dayType, setDayType] = useState('f');

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

  const addNewTiming = () => {
    if (!newTiming) {
      return;
    }

    setTimings(previousTiming => {
      setNewTimeSlotLoaing(true);
      previousTiming.push({
        slot_time: newTiming,
        available_count: 0,
        order: timings.length + 1,
        is_newly_added: true,
      });
      console.log(previousTiming);
      setNewTimeSlotLoaing(false);
      setNewTiming('');
      return previousTiming;
    });
  };

  const removeTiming = timeSlot => {
    setTimings(previousTiming => {
      return previousTiming.filter(
        timingSlot => timingSlot.slot_time !== timeSlot,
      );
    });
  };

  const TimingSlot = ({
    timeName,
    availableCount,
    onAvailabeCountChange,
    onRemoveTiming,
    showCancelButton = false,
    showAvailableCount = false,
  }: any) => {
    // console.log(item);
    return (
      <View style={styles.timeWrapper}>
        {timeName && <Text style={styles.slotTimeText}> {timeName}</Text>}

        {showAvailableCount && (
          <TextInput
            style={[globalStyles.input, styles.timingInput]}
            multiline
            keyboardType="numeric"
            placeholderTextColor="grey"
            onChangeText={onAvailabeCountChange}
            value={availableCount.toString()}
          />
        )}

        {showCancelButton && (
          <TouchableOpacity
            style={styles.removeNewTimingWrapper}
            onPress={() => onRemoveTiming(timeName)}>
            <Text style={styles.removeNewTimingText}>X</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  async function updateDateInfo() {
    try {
      timings.forEach(function (elem) {
        delete elem.is_newly_added;
      });
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

  async function updateDefaultTimeInfo() {
    try {
      const newDefaultTimings = {
        ...defaultTimings,
        available_count: defaultAvailableTime,
        stop_booking: stopBooking,
      };
      console.log(newDefaultTimings);
      await selectedDateContext.updateDefaultTimeDetails(newDefaultTimings);
      Alert.alert('Time Configuration updated', undefined, [{text: 'OK'}]);
    } catch (err) {
      commonErrorHandler(err);
    }
  }

  async function handleSubmit() {
    if (dateType === 'ats') {
      await updateDefaultTimeInfo();
    } else if (dateType === 'e') {
      await updateDateInfo();
    } else {
      await addDateInfo();
    }
  }

  async function updateDefaultTimingDetails(key: string, value: any) {
    console.log(value);
    setDefaultTimings(previousDefaultTimings => {
      previousDefaultTimings[key] = value;
      return previousDefaultTimings;
    });
  }

  function handleDefaultTimeNameRemoval(removedName) {
    setdefaultTimingNames(previousNames => {
      return previousNames.filter(name => name !== removedName);
    });
    const key = dayType === 'f' ? 'timings' : 'timings_half_day';
    console.log(key);
    updateDefaultTimingDetails(
      key,
      !defaultTimingNames
        ? []
        : defaultTimingNames.filter(name => name !== removedName),
    );
  }

  function setNewTimingName() {
    setNewTiming(newTiming);
    setdefaultTimingNames(previousNames => {
      previousNames.push(newTiming);
      return previousNames;
    });
    const key = dayType === 'f' ? 'timings' : 'timings_half_day';
    updateDefaultTimingDetails(key, defaultTimingNames);
    setNewTiming('');
  }

  function handleDayTypeChange(value: string) {
    setdefaultTimingNames(
      value === 'f' ? defaultTimings.timings : defaultTimings.timings_half_day,
    );
    setDayType(value);
  }

  async function handleDateTypeChange(value: string) {
    setSelectedDate(undefined);
    if (value === 'ats') {
      const defaultTimingsObj =
        await selectedDateContext.initializeDefaultTimeDetails();
      console.log(defaultTimingsObj);
      setDefaultTimings(defaultTimingsObj);
      setStopBooking(defaultTimingsObj.stop_booking);
      setDefaultAvailableTimeCount(defaultTimingsObj.available_count);
      setdefaultTimingNames(defaultTimingsObj.timings); // since f is default selected
      setTimeout(() => {
        console.log('test');
        console.log(defaultTimings);
      }, 2000);
    }
    setDateType(value);
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
                {
                  label: 'Edit Time Slot',
                  optionKey: 'ats',
                  color: dateType === 'ats' ? '#ff0000' : undefined,
                },
              ]}
              value={dateType}
              onChange={handleDateTypeChange}
            />
          </View>
          {defaultTimings !== undefined && dateType === 'ats' && (
            <View>
              <View style={styles.currentStatusWrapper}>
                {stopBooking && (
                  <View style={styles.statusWrapper}>
                    {/* <View style={styles.greenCircle} /> */}
                    <Text style={styles.checkedOutStatus}>
                      Bookings are disabled now
                    </Text>
                  </View>
                )}
                {!stopBooking && (
                  <View style={styles.statusWrapper}>
                    {/* <View style={styles.greyCircle} /> */}
                    <Text style={styles.checkedOutStatus}>
                      Bookins are enabled now
                    </Text>
                  </View>
                )}
                <View style={styles.rhs}>
                  <Switch
                    trackColor={{false: 'grey', true: 'blue'}}
                    thumbColor={'#f4f3f4'}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={() => setStopBooking(!stopBooking)}
                    value={!stopBooking}
                  />
                </View>
              </View>
              <View style={styles.DateSelectWrapper}>
                <TimingSlot
                  timeName="Default Available Count"
                  availableCount={defaultAvailableTime}
                  showAvailableCount={true}
                  onAvailabeCountChange={setDefaultAvailableTimeCount}
                  showCancelButton={false}
                />
              </View>
              <View style={styles.DateSelectWrapper}>
                <RadioButtonGroup
                  options={[
                    {
                      label: 'Half Day Slots',
                      optionKey: 'h',
                      color: dateType === 'h' ? '#ff0000' : undefined,
                    },
                    {
                      label: 'Full Day Slots',
                      optionKey: 'f',
                      color: dateType === 'f' ? '#ff0000' : undefined,
                    },
                  ]}
                  value={dayType}
                  onChange={handleDayTypeChange}
                />
              </View>
              <View style={styles.currentStatusWrapper}>
                {defaultTimingNames && (
                  <View>
                    <Text style={styles.checkedOutStatus}>
                      Modify Default Timings:
                    </Text>
                    <ScrollView>
                      {defaultTimingNames.map(
                        (timingName, index) =>
                          timingName && (
                            <TimingSlot
                              key={`timingSlot.slot_time - ${index}`}
                              timeName={timingName}
                              showAvailableCount={false}
                              showCancelButton={true}
                              onRemoveTiming={handleDefaultTimeNameRemoval}
                            />
                          ),
                      )}
                      {isNewTimeSlotLoaing && (
                        <ActivityIndicator size={'large'} color={'#0000ff'} />
                      )}
                      {!isNewTimeSlotLoaing && (
                        <View style={styles.timeWrapper}>
                          <TextInput
                            style={[globalStyles.input, styles.addtimingInput]}
                            multiline
                            placeholderTextColor="grey"
                            onChangeText={setNewTiming}
                            value={newTiming}
                          />
                          <TouchableOpacity onPress={setNewTimingName}>
                            <Text style={styles.addNewTimingText}>
                              Add New Timing
                            </Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    </ScrollView>
                  </View>
                )}
              </View>
            </View>
          )}
          {dateType !== 'ats' && (
            <View>
              <View style={styles.DateSelectWrapper}>
                <Text style={styles.DateSelectTitle}> Select a Date </Text>
                <View>
                  <TouchableWithoutFeedback onPress={showDatePicker}>
                    <Text
                      style={[
                        globalStyles.input,
                        selectedDate
                          ? styles.dateSelectedText
                          : styles.placeHolder,
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
                              key={`timingSlot.slot_time - ${index}`}
                              timeName={timingSlot.slot_time}
                              availableCount={timingSlot.available_count}
                              onAvailabeCountChange={value =>
                                handleTimiChange(index, value)
                              }
                              showAvailableCount={true}
                              showCancelButton={timingSlot.is_newly_added}
                              onRemoveTiming={removeTiming}
                            />
                          ))}
                          {isNewTimeSlotLoaing && (
                            <ActivityIndicator
                              size={'large'}
                              color={'#0000ff'}
                            />
                          )}
                          {!isNewTimeSlotLoaing && (
                            <View style={styles.timeWrapper}>
                              <TextInput
                                style={[
                                  globalStyles.input,
                                  styles.addtimingInput,
                                ]}
                                multiline
                                placeholderTextColor="grey"
                                onChangeText={setNewTiming}
                                value={newTiming}
                              />
                              <TouchableOpacity onPress={addNewTiming}>
                                <Text style={styles.addNewTimingText}>
                                  Add New Timing
                                </Text>
                              </TouchableOpacity>
                            </View>
                          )}
                        </ScrollView>
                      </View>
                    )}
                  </View>
                </View>
              )}
            </View>
          )}
        </ScrollView>
        {(dateType === 'ats' || selectedDate) && (
          <View style={styles.saveButtonWrapper}>
            <TouchableOpacity
              onPress={() => {
                handleSubmit();
              }}
              style={styles.addNewButtonWrapper}>
              {dateType === 'ats' && (
                <Text style={styles.addNewLabel}>save configuration </Text>
              )}
              {dateType === 'e' && (
                <Text style={styles.addNewLabel}>save configuration </Text>
              )}
              {dateType === 'a' && (
                <Text style={styles.addNewLabel}>add date</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
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
  addtimingInput: {
    width: '50%',
    marginRight: 'auto',
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
  removeNewTimingWrapper: {
    marginLeft: 'auto',
  },
  removeNewTimingText: {
    color: 'red',
    fontWeight: '700',
    fontSize: 20,
  },
  addNewTimingText: {
    color: 'blue',
  },
  addNewTimingWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
});

export default ManageSlots;
