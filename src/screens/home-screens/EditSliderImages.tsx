import React, {useContext} from 'react';
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';

import storage from '@react-native-firebase/storage';
import {launchImageLibrary} from 'react-native-image-picker';
import {SliderImagedContext} from 'src/contexts/SliderImagesContext';
import Spinner from 'react-native-loading-spinner-overlay';

const reference = storage().ref('black-t-shirt-sm.png');

export default function EditSliderImages({route, navigation}: any) {
  console.log('previous screen::', navigation.previousScreen);
  const sliderImagedContext = useContext(SliderImagedContext);
  console.log(sliderImagedContext);
  // console.log(images.sliderImages);
  function imageWithEditButton({item, index}: any) {
    return (
      <View style={styles.card}>
        {/* <View style={styles.header}> */}
        <View style={styles.cardContent}>
          <View style={styles.cardLhs}>
            <Text numberOfLines={1} ellipsizeMode="tail" style={styles.name}>
              Image {index + 1}
            </Text>
          </View>
          <View style={styles.cardRhs}>
            <TouchableOpacity
              onPress={() => {
                const onImageSelection = (selectedImage: any) => {
                  console.log('image selected');
                  console.log(selectedImage);
                  if (selectedImage.didCancel) {
                    console.log('cancel handled');
                    return;
                  }
                  let tempSliderImages = JSON.parse(
                    JSON.stringify(sliderImagedContext.sliderImages),
                  );
                  tempSliderImages[index] = selectedImage.assets[0].uri;
                  sliderImagedContext.updateSliderImages(tempSliderImages);
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
          <Image
            source={{
              uri: item,
            }}
            style={styles.displayImage}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.cardsWrapper}>
      <Spinner
        visible={sliderImagedContext.isSliderImagesLoading}
        textContent={'Loading...'}
        textStyle={styles.spinnerTextStyle}
        cancelable
      />
      <FlatList
        data={sliderImagedContext.sliderImages}
        renderItem={imageWithEditButton}
        extraData={imageWithEditButton}
        initialNumToRender={0}
        keyExtractor={item => item}
      />
    </View>
  );
}
const styles = StyleSheet.create({
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
