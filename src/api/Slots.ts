import {triggerAPI} from 'src/api/APIManager';

export async function getSlots() {
  const apiConfig = {
    method: 'GET',
    endPoint: 'getSlots',
  };
  const responseData = await triggerAPI(apiConfig);
  return responseData.slots;
}

export async function getSlotDateDetails(payload: any) {
  const apiConfig = {
    method: 'GET',
    endPoint: 'getSlotDateDetails',
  };
  const responseData = await triggerAPI(apiConfig, payload);
  return responseData.slot_date;
}

export async function updateSlotDateDetails(payload: any) {
  const apiConfig = {
    method: 'PUT',
    endPoint: 'updateSlotDateDetails',
  };
  const responseData = await triggerAPI(apiConfig, payload);
  return responseData.slot_date;
}

export async function addSelectedDateDetails(payload: any) {
  const apiConfig = {
    method: 'POST',
    endPoint: 'addSelectedDateDetails',
  };
  const responseData = await triggerAPI(apiConfig, payload);
  return responseData.slot_date;
}
