import React, {useEffect, useState, useContext} from 'react';
import {
  ActivityIndicator,
  Text,
  ScrollView,
  View,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
// import * as firebase from 'firebase';
import {
  setStatus,
  setBannerMessageRealTime,
  getStatus,
  getBannerMessage,
} from 'src/api/firebase';
import {commonErrorHandler} from 'src/error-handling/commonErrorHanlders';
import {getYoutubeVideos} from 'src/api/HomeScreen';
import {SliderBox} from 'react-native-image-slider-box';
import EditInputModal from 'src/components/EditInputModal';
import {SliderImagedContext} from 'src/contexts/SliderImagesContext';
import {updateYoutubeVidoes} from 'src/api/HomeScreen';
import auth from '@react-native-firebase/auth';

export const sliderImagesContext = React.createContext(undefined as any);

export default function HomeScreen({navigation}: any) {
  const [isAvalable, setAvailable] = useState(false);
  const [bannerMessage, setBannerMessage] = useState();
  const [youtubeVideos, setYoutubeVideos] = useState([]);

  const [isYoutubeUrlsLoading, setIsYoutubeUrlsLoading] = useState(true);
  const [editInputModalConfig, setEditInputModalConfig] = useState({
    label: '',
    value: '',
    callBack: (value = '') => {},
  });
  const sliderImagedContext = useContext(SliderImagedContext);

  useEffect(() => {
    console.log('homescreen.tsx mounted');
    getStatus(setAvailable);
    getBannerMessage(setBannerMessage);
    setIsYoutubeUrlsLoading(true);

    console.log('getting youtubeVideos');

    const getYoutubeVideoData = getYoutubeVideos().then(videos => {
      console.log('updating youtube to state');
      console.log(videos);
      setYoutubeVideos(JSON.parse(JSON.stringify(videos)));
      console.log('setting loading false');
    });

    Promise.all([
      getYoutubeVideoData,
      sliderImagedContext.initializeSliderImages(),
    ])
      .catch(error => {
        console.log('homescreen:' + error);
        commonErrorHandler(error);
      })
      .finally(() => {
        console.log('loading false');
        setIsYoutubeUrlsLoading(false);
      });
    return () => {
      console.log('homescreen.tsx initialized');
    };
  }, []);

  useEffect(() => {
    console.log('karthick aviailable status');
    console.log(isAvalable);
  }, [isAvalable]);

  useEffect(() => {
    console.log('karthick bannerMessage');
    console.log(bannerMessage);
  }, [bannerMessage]);

  function toggleSwitch() {
    setStatus(!isAvalable);
  }

  const [showEditInputModal, setShowEditInputModal] = useState(false);

  function VideoWithEditButton({item, index}: any) {
    return (
      <View style={styles.card}>
        {/* <View style={styles.header}> */}
        <View style={styles.cardContent}>
          <View style={styles.cardLhs}>
            <Text numberOfLines={1} ellipsizeMode="tail" style={styles.name}>
              Video {index + 1}
            </Text>
          </View>
          <View style={styles.cardRhs}>
            <TouchableOpacity
              onPress={() => {
                const updateVideo = async (value: string | undefined) => {
                  try {
                    if (!value) {
                      return;
                    }
                    console.log('updated youtube videos');
                    console.log(value);
                    const regExp =
                      /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
                    const match = value.match(regExp);
                    if (match && match[2].length === 11) {
                      console.log(match[2]);
                      let newSetOfVideos = JSON.parse(
                        JSON.stringify(youtubeVideos),
                      );
                      const payload = {
                        queryParams: {
                          uid: auth().currentUser?.uid,
                          video_id: newSetOfVideos[index],
                          udpated_video_id: match[2],
                        },
                      };
                      await updateYoutubeVidoes(payload);
                      newSetOfVideos[index] = match[2];
                      setYoutubeVideos(newSetOfVideos);
                    } else {
                      //error
                      commonErrorHandler(
                        new Error(
                          'error while decoding Youtube URL, try a different URL',
                        ),
                      );
                    }
                    setShowEditInputModal(false);
                  } catch (err) {
                    commonErrorHandler(err);
                  }
                };

                setEditInputModalConfig({
                  label: 'Video Link:',
                  value: `https://www.youtube.com/watch?v=${item}`,
                  callBack: updateVideo,
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
        {/* </View> */}
        <View style={styles.body}>
          <YoutubePlayer key={index} height={250} play={false} videoId={item} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.homeScreenWrapper}>
      <ScrollView>
        <View style={styles.currentStatusWrapper}>
          {isAvalable && (
            <View style={styles.statusWrapper}>
              {/* <View style={styles.greenCircle} /> */}
              <Text style={styles.checkedOutStatus}> You are checked In </Text>
            </View>
          )}
          {!isAvalable && (
            <View style={styles.statusWrapper}>
              {/* <View style={styles.greyCircle} /> */}
              <Text style={styles.checkedOutStatus}> You are checked out </Text>
            </View>
          )}
          <View style={styles.rhs}>
            <Switch
              trackColor={{false: 'grey', true: 'blue'}}
              thumbColor={'#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitch}
              value={isAvalable}
            />
          </View>
        </View>
        <View style={styles.currentStatusWrapper}>
          <View style={styles.lhs}>
            <Text style={styles.checkedOutStatus}>Banner Message:</Text>
            <Text style={styles.bannerMessage}>{bannerMessage}</Text>
          </View>

          <View style={styles.rhs}>
            <TouchableOpacity
              onPress={() => {
                console.log('pressed');

                setEditInputModalConfig({
                  label: 'Banner Message:',
                  value: bannerMessage,
                  callBack: setBannerMessageRealTime,
                });
                setShowEditInputModal(true);
              }}>
              <Image
                source={require('assets/pngs/edit-1.png')}
                resizeMode="contain"
                style={styles.editImage}
              />
            </TouchableOpacity>

            <EditInputModal
              showMoal={showEditInputModal}
              onClose={() => setShowEditInputModal(false)}
              label={editInputModalConfig.label}
              value={editInputModalConfig.value}
              onSave={editInputModalConfig.callBack}
            />
          </View>
        </View>

        <View style={styles.sliderEditWrapper}>
          <View style={styles.editSliterTitleWrapper}>
            <View>
              <Text style={styles.checkedOutStatus}> Images </Text>
            </View>

            <View style={styles.rhs}>
              <View style={styles.editButtonWrapper}>
                {!sliderImagedContext.isSliderImagesLoading && (
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('EditSliderImages', {
                        previousScreen: 'HomeScreen',
                      });
                    }}>
                    <Image
                      source={require('assets/pngs/edit-1.png')}
                      resizeMode="contain"
                      style={styles.editImage}
                    />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
          <View style={styles.bottomItem}>
            {sliderImagedContext.isSliderImagesLoading && (
              <ActivityIndicator size="large" color="#0000ff" />
            )}
            {!sliderImagedContext.isSliderImagesLoading && (
              <View style={styles.slideBoxWrapper}>
                <SliderBox
                  autoplay
                  circleLoop
                  dotColor="#00790D"
                  ImageComponentStyle={styles.imageStyle}
                  sliderBoxHeight={200}
                  resizeMode="stretch"
                  images={sliderImagedContext.sliderImages}
                />
              </View>
            )}
          </View>
        </View>

        <View style={styles.sliderEditWrapper}>
          {/* <View style={styles.editSliterTitleWrapper}>
            <View>
              <Text style={styles.checkedOutStatus}> Videos </Text>
            </View>

            <View style={styles.rhs}>
              <View style={styles.editButtonWrapper}>
                {!isYoutubeUrlsLoading && (
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('EditYoutubeVideos', {
                        previousScreen: 'HomeScreen',
                      });
                    }}>
                    <Image
                      source={require('assets/pngs/edit-1.png')}
                      resizeMode="contain"
                      style={styles.editImage}
                    />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View> */}
          {isYoutubeUrlsLoading && (
            <ActivityIndicator size="large" color="#0000ff" />
          )}
          {!isYoutubeUrlsLoading && (
            // <View>
            //   <Text>Need to look for an alternative</Text>
            // </View>
            // <FlatList
            //   data={youtubeVideos}
            //   renderItem={VideoWithEditButton}
            //   extraData={VideoWithEditButton}
            //   initialNumToRender={0}
            //   keyExtractor={item => item}
            // />
            <ScrollView>
              {isYoutubeUrlsLoading && (
                <ActivityIndicator size="large" color="#0000ff" />
              )}
              {!isYoutubeUrlsLoading && (
                <View style={styles.videoWrapper}>
                  {youtubeVideos.map((videoId: string, index: number) => (
                    <VideoWithEditButton
                      key={index}
                      item={youtubeVideos[index]}
                      index={index}
                    />
                    // <YoutubePlayer
                    //   key={index}
                    //   height={250}
                    //   play={false}
                    //   videoId={videoId}
                    // />
                  ))}
                </View>
              )}
              <View style={styles.emptyMargin} />
            </ScrollView>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  homeScreenWrapper: {
    display: 'flex',
    flexDirection: 'column',
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
  sliderEditWrapper: {
    backgroundColor: '#fff',
    margin: 10,
    elevation: 5,
    borderRadius: 5,
    padding: 10,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  youtubeTitleWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  youtubeTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#00790D',

    marginBottom: 10,
  },
  videoWrapper: {
    margin: 10,
  },
  bannerMessage: {
    flex: 1,
    color: '#0000FF',
    fontWeight: '500',
    flexDirection: 'row',
    fontSize: 24,
  },
  statusWrapper: {
    display: 'flex',
    color: '#FF0000',
    fontWeight: '500',
    fontSize: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  greenCircle: {
    color: 'green',
    backgroundColor: 'green',
    width: 20,
    height: 20,
    borderRadius: 10,
    marginBottom: 10,
  },
  greyCircle: {
    color: '#444',
    backgroundColor: '#444',
    width: 20,
    height: 20,
    borderRadius: 10,
    marginBottom: 10,
  },
  sliderBoxWrapper: {
    display: 'flex',
    justifyContent: 'center',
    // alignItems: 'center',
    borderRadius: 15,
    backgroundColor: '#C5C5C5',
    margin: 10,
  },
  imageStyle: {
    borderRadius: 15,
    width: '90%',
    marginTop: 5,
  },
  emptyMargin: {
    marginBottom: 80,
  },
  checkedOutStatus: {
    color: '#444',
    fontSize: 16,
    fontWeight: '500',
  },
  checkedInStatus: {
    color: 'green',
  },
  rhs: {
    width: '10%',
    marginLeft: 'auto',
  },
  editImage: {
    width: 30,
    height: 30,
  },
  editButtonWrapper: {
    alignItems: 'center',
    paddingVertical: 5,
  },
  slideBoxWrapper: {
    right: 20,
  },
  lhs: {
    width: '90%',
  },
  editSliterTitleWrapper: {
    display: 'flex',
    flexDirection: 'row',
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
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  body: {
    marginTop: 10,
  },
});
