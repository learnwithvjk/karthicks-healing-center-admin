import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
  Dimensions,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {commonErrorHandler} from 'src/error-handling/commonErrorHanlders';
import {getClinicDetails, updateClinicDetails} from 'src/api/HomeScreen';
import storage from '@react-native-firebase/storage';
import {launchImageLibrary} from 'react-native-image-picker';
import EditInputModal from 'src/components/EditInputModal';
import auth from '@react-native-firebase/auth';

const updateClinicInfo = async (key: string, value: any, clinicId: string) => {
  let payload = {
    queryParams: {
      uid: auth().currentUser?.uid,
      clinic_id: clinicId,
    },
  };
  payload.queryParams[key] = value;
  await updateClinicDetails(payload);
};

export default function ReachUs() {
  const [clinicDetails, setClinicDetails] = useState([]);
  const [isAppLogoLoading, setIsAppLogoLoading] = useState(false);
  const [isClinicDetailsLoading, setIsClinicDetailsLoading] = useState(true);
  const [editInputModalConfig, setEditInputModalConfig] = useState({
    label: '',
    value: '',
    callBack: (value = '') => {},
  });
  const [showEditInputModal, setShowEditInputModal] = useState(false);

  useEffect(() => {
    console.log('reachus.tsx mounted');
    setIsClinicDetailsLoading(true);

    console.log('getting youtubeVideos');
    getClinicDetails()
      .then(async clinics => {
        console.log('updating clinic to state');
        console.log(clinics);
        const clinicDetail = clinics[0];
        if (clinicDetail) {
          const locationMapUrl = await storage()
            .ref(`clinic-location/location-map-${clinicDetail.order}.png`)
            .getDownloadURL();
          const appLogo = await storage().ref('app-logo.png').getDownloadURL();
          console.log(locationMapUrl);
          console.log(appLogo);
          setClinicDetails(
            JSON.parse(
              JSON.stringify({
                ...clinicDetail,
                app_logo: appLogo,
                map_location_uri: locationMapUrl,
              }),
            ),
          );
        }
      })
      .catch(error => {
        console.log('bookingListingPageErr:' + error);
        commonErrorHandler(error);
      })
      .finally(() => {
        console.log('setting loading false');
        setIsClinicDetailsLoading(false);
      });
    return () => {
      console.log('homescreen.tsx initialized');
    };
  }, []);

  const ImageWithEditButton = () => {
    return (
      <View style={styles.card}>
        {/* <View style={styles.header}> */}
        <View style={styles.cardContent}>
          <View style={styles.cardLhs}>
            <Text numberOfLines={1} ellipsizeMode="tail" style={styles.name}>
              App Logo
            </Text>
          </View>
          <View style={styles.cardRhs}>
            <TouchableOpacity
              onPress={() => {
                const onImageSelection = async (selectedImage: any) => {
                  try {
                    setIsAppLogoLoading(true);
                    console.log('image selected');
                    console.log(selectedImage);
                    if (selectedImage.didCancel) {
                      console.log('cancel handled');
                      return;
                    }
                    await storage()
                      .ref('app-logo.png')
                      .putFile(selectedImage.assets[0].uri);
                    setClinicDetails(
                      JSON.parse(
                        JSON.stringify({
                          ...clinicDetails,
                          app_logo: selectedImage.assets[0].uri,
                        }),
                      ),
                    );
                    setIsAppLogoLoading(false);
                  } catch (err) {
                    commonErrorHandler(err);
                  }

                  // setImages(
                  //   (previousValue: any) =>
                  //     (previousValue[index] = selectedImage.path),
                  // );
                };
                launchImageLibrary(
                  {
                    mediaType: 'photo',
                  },
                  onImageSelection,
                );
              }}>
              <Image
                source={require('assets/pngs/edit-1.png')}
                resizeMode="contain"
                style={styles.editImage}
              />
            </TouchableOpacity>
          </View>
        </View>
        {/* </View> */}
        <View style={styles.body}>
          {isAppLogoLoading && (
            <ActivityIndicator size="large" color="#0000ff" />
          )}
          {!isAppLogoLoading && (
            <Image
              source={{
                uri: clinicDetails.app_logo,
              }}
              resizeMode="contain"
              style={[styles.largeSizeImage]}
            />
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.ReachUsWrapper}>
      {isClinicDetailsLoading && (
        <View style={styles.activityLoadWrapper}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
      {!isClinicDetailsLoading && (
        <ScrollView>
          <View style={styles.logoAndTitle}>
            <ImageWithEditButton />
          </View>
          <View />
          {isClinicDetailsLoading && (
            <ActivityIndicator size="large" color="#0000ff" />
          )}
          {!isClinicDetailsLoading && (
            <View style={styles.whereAreWeWrapper}>
              {/* <Text style={[styles.whereAreWeText]}> Where are we? </Text> */}
              <View style={styles.card}>
                <View style={styles.cardContent}>
                  <View style={styles.cardLhs}>
                    <Text
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={styles.name}>
                      Clinic Address
                    </Text>
                  </View>
                  <View style={styles.cardRhs}>
                    <TouchableOpacity
                      onPress={() => {
                        const onNewAddressSave = async (value: string) => {
                          try {
                            await updateClinicInfo(
                              'address',
                              value,
                              clinicDetails.clinic_id,
                            );
                            setClinicDetails({
                              ...clinicDetails,
                              address: value,
                            });
                            setShowEditInputModal(false);
                          } catch (err) {
                            commonErrorHandler(err);
                          }
                        };
                        setEditInputModalConfig({
                          label: 'Clinic address:',
                          value: '',
                          callBack: onNewAddressSave,
                        });
                        setShowEditInputModal(true);
                      }}>
                      <Image
                        source={require('assets/pngs/edit-1.png')}
                        resizeMode="contain"
                        style={styles.editImage}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
                <View>
                  <Text style={[styles.addressText]}>
                    {clinicDetails.address}
                  </Text>
                </View>
              </View>
            </View>
          )}
          {!isClinicDetailsLoading && (
            <View style={styles.whereAreWeWrapper}>
              {/* <Text style={[styles.whereAreWeText]}> Where are we? </Text> */}
              <View style={styles.card}>
                <View style={styles.cardContent}>
                  <View style={styles.cardLhs}>
                    <Text
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={styles.name}>
                      Clinic Phone
                    </Text>
                  </View>
                  <View style={styles.cardRhs}>
                    <TouchableOpacity
                      onPress={() => {
                        const onNewPhoneAdded = async (value: string) => {
                          try {
                            await updateClinicInfo(
                              'phone',
                              value,
                              clinicDetails.clinic_id,
                            );
                            setClinicDetails({
                              ...clinicDetails,
                              phone: value,
                            });
                            setShowEditInputModal(false);
                          } catch (err) {
                            commonErrorHandler(err);
                          }
                        };
                        setEditInputModalConfig({
                          label: 'Clinic Phone:',
                          value: '',
                          callBack: onNewPhoneAdded,
                        });
                        setShowEditInputModal(true);
                      }}>
                      <Image
                        source={require('assets/pngs/edit-1.png')}
                        resizeMode="contain"
                        style={styles.editImage}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
                <View>
                  <Text style={[styles.addressText]}>
                    {clinicDetails.phone}
                  </Text>
                </View>
              </View>
            </View>
          )}
          {!isClinicDetailsLoading && (
            <View style={styles.whereAreWeWrapper}>
              {/* <Text style={[styles.whereAreWeText]}> Where are we? </Text> */}
              <View style={styles.card}>
                <View style={styles.cardContent}>
                  <View style={styles.cardLhs}>
                    <Text
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={styles.name}>
                      Clinic Map Location URL:
                    </Text>
                  </View>
                  <View style={styles.cardRhs}>
                    <TouchableOpacity
                      onPress={() => {
                        const onMapLocationChanged = async (value: string) => {
                          try {
                            await updateClinicInfo(
                              'map_url',
                              value,
                              clinicDetails.clinic_id,
                            );
                            setClinicDetails({
                              ...clinicDetails,
                              map_url: value,
                            });
                            setShowEditInputModal(false);
                          } catch (err) {
                            commonErrorHandler(err);
                          }
                        };
                        setEditInputModalConfig({
                          label: 'Clinic Map Location URL:',
                          value: '',
                          callBack: onMapLocationChanged,
                        });
                        setShowEditInputModal(true);
                      }}>
                      <Image
                        source={require('assets/pngs/edit-1.png')}
                        resizeMode="contain"
                        style={styles.editImage}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
                <View>
                  <Text style={[styles.addressText]}>
                    {clinicDetails.map_url}
                  </Text>
                </View>
              </View>
            </View>
          )}

          <EditInputModal
            showMoal={showEditInputModal}
            onClose={() => setShowEditInputModal(false)}
            label={editInputModalConfig.label}
            value={editInputModalConfig.value}
            onSave={editInputModalConfig.callBack}
          />
          <View />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  ReachUsWrapper: {
    flex: 1,
  },
  activityLoadWrapper: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoAndTitle: {
    margin: 10,
  },
  largeSizeImage: {
    width: 300,
    height: 220,
  },
  titleText: {
    fontSize: 18,
    color: '#D4AF37',
  },
  whereAreWeWrapper: {
    marginHorizontal: 10,
  },
  whereAreWeText: {
    fontSize: 18,
    marginBottom: 10,
  },
  addressText: {
    fontSize: 18,
    color: '#000',
    fontWeight: '500',
  },
  mapWrapper: {
    marginTop: 20,
    marginHorizontal: 30,
  },
  mapImage: {
    width: Dimensions.get('window').width - 60,
    height: 220,
    backgroundColor: 'grey',
  },
  cardsWrapper: {
    flex: 1,
    margin: 20,
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  card: {
    padding: 10,
    backgroundColor: '#fff',
    marginBottom: 10,
    flexWrap: 'wrap',
  },
  cardContent: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  cardLhs: {
    flex: 7,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  cardRhs: {
    flex: 3,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  moreInfo: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingTop: 10,
    paddingBottom: 20,
  },
  name: {
    fontWeight: '500',
    color: '#000',
  },
  editImage: {
    width: 30,
    height: 30,
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  displayImage: {
    width: '100%',
    height: 100,
  },
  body: {
    marginTop: 10,
  },
});
