import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL

// =================Blood Group URL=====================
export const GET_ALL_BLOOD_GROUP = `${BASE_API_URL}/BloodGroup/GetBloodGroupList` //Get Blood Group

// =========================Get Blood Group=====================
export function getBloodGroupApi() {
  return axios.get(GET_ALL_BLOOD_GROUP)
}