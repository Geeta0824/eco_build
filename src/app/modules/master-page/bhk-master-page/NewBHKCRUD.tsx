import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL
// =================Emp Education URL=====================
export const GET_ALL_BHK = `${BASE_API_URL}/BHKNew/GetBHKList`
export const GET_ACTIVE_BHK = `${BASE_API_URL}/BHKNew/GetDropDownBHKList`
export const CREATE_BHK = `${BASE_API_URL}/BHKNew/AddBHKDetails`
export const GET_BHK_BY_BHK_ID = `${BASE_API_URL}/BHKNew/GetBHKByBHKID`
export const UPDATE_BHK = `${BASE_API_URL}/BHKNew/UpdateBHKDetails`
export const DELETE_BHK = `${BASE_API_URL}/BHKNew/DeleteBHK`
export const ISACTIVE_BHK = `${BASE_API_URL}/BHKNew/UpdateBHKIsactive`

export function getAllBHK() {
  return axios.get(GET_ALL_BHK)
}

export function getActiveBHKApi() {
  return axios.get(GET_ACTIVE_BHK)
}

export function createBHK(encodedReq: string) {
  return axios.post(CREATE_BHK, {encodedReq})
}

export function getBHKByBHKId(encodedReq: string) {
  return axios.post(GET_BHK_BY_BHK_ID, {encodedReq})
}
export function updateBHK(encodedReq: string) {
  return axios.post(UPDATE_BHK, {
    encodedReq,
  })
}
export function deleteBHK(encodedReq: string) {
  return axios.post(DELETE_BHK, {encodedReq})
}
export function isActiveBHK(encodedReq: string) {
  return axios.post(ISACTIVE_BHK, {encodedReq})
}
