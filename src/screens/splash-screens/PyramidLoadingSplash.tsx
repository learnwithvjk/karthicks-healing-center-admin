import React, {useEffect, useRef} from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
} from 'react-native';

// import LottieView from 'lottie-react-native';

export default function PyramidLoadingSplash({
  postSplashAction,
  isLoading,
  isError,
}: any) {
  const startAnimation = useRef(new Animated.Value(0)).current;
  // async function onAnimationComplete() {
  //   if (isError) {
  //     return;
  //   }
  //   postSplashAction();
  //   Animated.sequence([
  //     Animated.timing(startAnimation, {
  //       toValue: 15,
  //       duration: 1000,
  //       useNativeDriver: true,
  //     }),
  //   ]).start(() => {
  //     // postSplashAction();
  //   });
  // }

  useEffect(() => {
    if (!isLoading) {
      if (isError) {
        return;
      }
      postSplashAction();
    }
  }, [isError, postSplashAction, isLoading]);

  return (
    <View style={styles.pageWrapper}>
      {/* <View style={styles.iconWrapper}>
        <View style={styles.lottieAnimation}>

        </View>
        <Animated.View
          style={{
            transform: [{scale: startAnimation}],
          }}>
          <View style={styles.diamondShield}>
            <View style={styles.diamondShieldTop} />
            <View style={styles.diamondShieldBottom} />
          </View>
        </Animated.View>
      </View> */}
      <Image
        source={require('assets/pngs/splash-image.png')}
        resizeMode="contain"
        style={styles.brandImage}
      />

      <View style={styles.titleWrapper}>
        <Text style={styles.title}> Karthik's Healing Centre </Text>
        <Text style={styles.desc}> (ADMIN ONLY) </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pageWrapper: {
    position: 'relative',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00790D',
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
  },
  iconWrapper: {
    position: 'relative',
    backgroundColor: '#00790D',
    height: 1,
    width: Dimensions.get('window').width / 2,
    display: 'flex',
    justifyContent: 'center',
  },
  lottieAnimation: {
    position: 'absolute',
    height: Dimensions.get('window').height / 2,
    width: Dimensions.get('window').width / 2,
    backgroundColor: '#00790D',
    color: '#fff',
  },
  titleWrapper: {
    position: 'relative',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
  },
  desc: {
    fontSize: 14,
    color: '#fff',
  },
  diamondShield: {
    top: Dimensions.get('window').width / 6.5,
    left: Dimensions.get('window').width / 4.3,
    height: Dimensions.get('window').width / 7,
    width: Dimensions.get('window').width / 7,
    transform: [{rotate: '180deg'}],
  },
  diamondShieldTop: {
    width: 0,
    height: 0,
    borderTopWidth: 50,
    borderTopColor: 'transparent',
    borderLeftColor: 'transparent',
    borderLeftWidth: 50,
    borderRightColor: 'transparent',
    borderRightWidth: 50,
    borderBottomColor: '#fff',
    borderBottomWidth: 20,
  },
  diamondShieldBottom: {
    width: 0,
    height: 0,
    borderTopWidth: 70,
    borderTopColor: '#fff',
    borderLeftColor: 'transparent',
    borderLeftWidth: 50,
    borderRightColor: 'transparent',
    borderRightWidth: 50,
    borderBottomColor: 'transparent',
    borderBottomWidth: 50,
  },
  brandImage: {
    width: '60%',
    height: '20%',
    marginBottom: 10,
  },
});
