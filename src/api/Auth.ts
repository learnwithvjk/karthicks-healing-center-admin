import {triggerAPI} from 'src/api/APIManager';

export async function checkIfUserIsAdmin(payload: any) {
  try {
    const apiConfig = {
      method: 'GET',
      endPoint: 'checkIfUserIsAdmin',
    };
    await triggerAPI(apiConfig, payload);
  } catch (error) {
    throw error;
  }
}
