import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL
//=====================Taluka URL=========================
export const GET_ALL_TALUKA = `${BASE_API_URL}/Taluka/GetTalukaList` //Get Taluka Page
export const POST_ALL_TALUKA = `${BASE_API_URL}/Taluka/AddTalukaDetails` //Create Taluka Page
export const TALUKA_DATA_BY_TALUKA_ID = `${BASE_API_URL}/Taluka/GetTalukaByTalukaID` //Update Taluka Page
export const UPDATE_TALUKA = `${BASE_API_URL}/Taluka/UpdateTalukaDetails` //Update Taluka Page
export const DELETE_TALUKA = `${BASE_API_URL}/Taluka/DeleteTaluka` //Delete Taluka Page
export const ISACTIVE_TALUKA = `${BASE_API_URL}/Taluka/UpdateTalukaIsactive` //Is Active Taluka Page
export const GET_TALUKA_BY_STATE_ID = `${BASE_API_URL}/Taluka/GetTalukaByDistrictID` //Is Active Taluka Page
export const GET_ALL_TALUKA_List_Filter = `${BASE_API_URL}/Taluka//GetTalukaFilterList` //Get Filter Taluka Page

export function getAllTaluka() {
  return axios.get(GET_ALL_TALUKA)
}
export function getAllTalukaFilter(districtID: number, searchText: string) {
  return axios.post(GET_ALL_TALUKA_List_Filter, {districtID, searchText})
}
// ================CREATE Taluka================
export function createTaluka(
  districtID: number,
  talukaName: string,
  isActive: boolean,
  createBy: number,
  ipAddress: string
) {
  return axios.post(POST_ALL_TALUKA, {
    districtID,
    talukaName,
    isActive,
    createBy,
    ipAddress,
  })
}
// ================UPDATE Taluka==============
export function getTalukaByTalukaId(talukaID: string) {
  return axios.post(TALUKA_DATA_BY_TALUKA_ID, {talukaID})
}
export function updateTaluka(
  talukaID: number,
  districtID: number,
  talukaName: string,
  isActive: boolean,
  updateBy: number,
  ipAddress: string
) {
  return axios.post(UPDATE_TALUKA, {
    talukaID,
    districtID,
    talukaName,
    isActive,
    updateBy,
    ipAddress,
  })
}
// ================DELETE Taluka==============
export function deleteTaluka(talukaId: number) {
  return axios.post(DELETE_TALUKA, {talukaId})
}
// =======================ISACTIVE Taluka==================
export function isActiveTaluka(talukaID: number, isActive: boolean) {
  return axios.post(ISACTIVE_TALUKA, {talukaID, isActive})
}

export function getTalukaByDistrictID(districtID: number) {
  return axios.post(GET_TALUKA_BY_STATE_ID, {districtID})
}
