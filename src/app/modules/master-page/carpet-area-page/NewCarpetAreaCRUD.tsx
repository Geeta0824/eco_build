import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL
// =================Emp Education URL=====================
export const GET_ALL_CARPET_AREA = `${BASE_API_URL}/CarpetArea_New/GetCarpetAreawEBList`
// export const GET_ACTIVE_CARPET_AREA = `${BASE_API_URL}/CarpetArea_New/GetDropDownCarpetAreaList`
export const CREATE_CARPET_AREA = `${BASE_API_URL}/CarpetArea_New/AddCarpetAreaDetails`
export const GET_CARPET_AREA_BY_CARPET_AREA_ID = `${BASE_API_URL}/CarpetArea_New/GetCarpetAreaByCarpetAreaID`
export const UPDATE_CARPET_AREA = `${BASE_API_URL}/CarpetArea_New/UpdateCarpetAreaDetails`
export const DELETE_CARPET_AREA = `${BASE_API_URL}/CarpetArea_New/DeleteCarpetArea`
export const ISACTIVE_CARPET_AREA = `${BASE_API_URL}/CarpetArea_New/UpdateCarpetAreaIsactive`

export function getAllCarpetArea() {
  return axios.get(GET_ALL_CARPET_AREA)
}

// export function getActiveCarpetAreaApi() {
//   return axios.get(GET_ACTIVE_CARPET_AREA)
// }

export function createCarpetArea(encodedReq: string) {
  return axios.post(CREATE_CARPET_AREA, {encodedReq})
}

export function getCarpetAreaByCarpetAreaId(encodedReq: string) {
  return axios.post(GET_CARPET_AREA_BY_CARPET_AREA_ID, {encodedReq})
}
export function updateCarpetArea(encodedReq: string) {
  return axios.post(UPDATE_CARPET_AREA, {encodedReq})
}
export function deleteCarpetArea(encodedReq: string) {
  return axios.post(DELETE_CARPET_AREA, {encodedReq})
}
export function isActiveCarpetArea(encodedReq: string) {
  return axios.post(ISACTIVE_CARPET_AREA, {encodedReq})
}
