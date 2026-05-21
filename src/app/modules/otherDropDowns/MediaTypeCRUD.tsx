import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL

// =================MediaType URL=====================
export const GET_ALL_MEDIA_TYPE = `${BASE_API_URL}/MediaType/GetMediaTypeList` //Get MediaType

// =========================Get MediaType=====================
export function getMediaTypeApi() {
  return axios.get(GET_ALL_MEDIA_TYPE)
}