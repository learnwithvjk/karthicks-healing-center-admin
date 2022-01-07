import React, {useState} from 'react';
import storage from '@react-native-firebase/storage';
import {getSliderImages} from 'src/api/HomeScreen';

export const SliderImagedContext = React.createContext({
  sliderImages: [] as Array<string>,
  isSliderImagesLoading: true,
  initializeSliderImages: () => {
    console.log('initializeSliderImages dummy method called');
  },
  updateSliderImages: (updatedImages: Array<any>) => {
    console.log('updateSliderImages dummy method called', updatedImages);
  },
});

const getSliderImagesFromAPI = () =>
  getSliderImages().then(async (images: Array<any>) => {
    console.log('updating images to state');
    console.log(images);
    const sliderImageArr = [];
    for await (const image of images) {
      const imageUrl = await storage()
        .ref(`dashboard-slider/slider-image-${image.order}.jpg`)
        .getDownloadURL();
      console.log(imageUrl);
      sliderImageArr.push(imageUrl);
    }
    return sliderImageArr;
  });

export const SliderImagesProvider = ({children}: any) => {
  const [sliderImages, setSliderImages] = useState<Array<string>>([]);
  const [isSliderImagesLoading, setIsSliderImagesLoading] =
    useState<boolean>(true);
  const initializeSliderImages = async () => {
    console.log('actual method called');
    setIsSliderImagesLoading(true);
    const images = await getSliderImagesFromAPI();
    console.log('images set');
    console.log(images);
    setSliderImages(images);
    setIsSliderImagesLoading(false);
  };

  const updateSliderImages = (updatedImages: Array<any>) => {
    setIsSliderImagesLoading(true);
    console.log('updating images');
    console.log(updatedImages);
    setSliderImages(updatedImages);
    console.log('updating done');
    setIsSliderImagesLoading(false);
  };
  return (
    <SliderImagedContext.Provider
      value={{
        sliderImages,
        isSliderImagesLoading,
        updateSliderImages,
        initializeSliderImages,
      }}>
      {children}
    </SliderImagedContext.Provider>
  );
};
