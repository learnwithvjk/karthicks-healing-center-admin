import {triggerAPI} from 'src/api/APIManager';

export async function getYoutubeVideos() {
  try {
    const apiConfig = {
      method: 'GET',
      endPoint: 'getYoutubeVideos',
    };
    const responseData = await triggerAPI(apiConfig);
    return responseData.videos;
  } catch (error) {
    throw error;
  }
}

export async function getClinicDetails() {
  try {
    const apiConfig = {
      method: 'GET',
      endPoint: 'getClinicDetails',
    };
    const responseData = await triggerAPI(apiConfig);
    return responseData.clinics;
  } catch (error) {
    throw error;
  }
}

export async function updateClinicDetails(payload: any) {
  try {
    const apiConfig = {
      method: 'PUT',
      endPoint: 'updateClinicDetails',
    };
    const responseData = await triggerAPI(apiConfig, payload);
    return responseData.clinics;
  } catch (error) {
    throw error;
  }
}

export async function getSliderImages() {
  try {
    const apiConfig = {
      method: 'GET',
      endPoint: 'getSliderImages',
    };
    const responseData = await triggerAPI(apiConfig);
    return responseData.slider_images;
  } catch (error) {
    throw error;
  }
}

export async function updateYoutubeVidoes(payload: any) {
  try {
    const apiConfig = {
      method: 'PUT',
      endPoint: 'updateYoutubeVidoes',
    };
    await triggerAPI(apiConfig, payload);
  } catch (error) {
    throw error;
  }
}
