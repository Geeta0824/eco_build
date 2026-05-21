import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL
// =================Emp Education URL=====================
export const GET_ALL_CARPET_AREA = `${BASE_API_URL}/CarpetArea/GetCarpetAreawEBList`
// export const GET_ACTIVE_CARPET_AREA = `${BASE_API_URL}/CarpetArea/GetDropDownCarpetAreaList`
export const CREATE_CARPET_AREA = `${BASE_API_URL}/CarpetArea/AddCarpetAreaDetails`
export const GET_CARPET_AREA_BY_CARPET_AREA_ID = `${BASE_API_URL}/CarpetArea/GetCarpetAreaByCarpetAreaID`
export const UPDATE_CARPET_AREA = `${BASE_API_URL}/CarpetArea/UpdateCarpetAreaDetails`
export const DELETE_CARPET_AREA = `${BASE_API_URL}/CarpetArea/DeleteCarpetArea`
export const ISACTIVE_CARPET_AREA = `${BASE_API_URL}/CarpetArea/UpdateCarpetAreaIsactive`

export function getAllCarpetArea() {
  return axios.get(GET_ALL_CARPET_AREA)
}

// export function getActiveCarpetAreaApi() {
//   return axios.get(GET_ACTIVE_CARPET_AREA)
// }

export function createCarpetArea(
  carpetArea: string,
  createBy: number,
  ipAddress: string
) {
  return axios.post(CREATE_CARPET_AREA, {carpetArea,  createBy, ipAddress})
}

export function getCarpetAreaByCarpetAreaId(carpetAreaID: string) {
  return axios.post(GET_CARPET_AREA_BY_CARPET_AREA_ID, {carpetAreaID})
}
export function updateCarpetArea(
  carpetAreaID: number,
  carpetArea: string,
  updateBy: number,
  ipAddress: string
) {
  return axios.post(UPDATE_CARPET_AREA, {
    carpetAreaID,
    carpetArea,
    updateBy,
    ipAddress,
  })
}
export function deleteCarpetArea(carpetAreaID: number) {
  return axios.post(DELETE_CARPET_AREA, {carpetAreaID})
}
export function isActiveCarpetArea(carpetAreaID: number, isActive: boolean) {
  return axios.post(ISACTIVE_CARPET_AREA, {carpetAreaID, isActive})
}
