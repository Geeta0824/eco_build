import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL

// =================Gender URL=====================
export const GET_ALL_GENDER = `${BASE_API_URL}/Gender/GetGenderList` //Get Gender

// =========================Get Gender=====================
export function getGenderApi() {
  return axios.get(GET_ALL_GENDER)
}