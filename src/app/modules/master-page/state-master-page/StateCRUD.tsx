import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL
//=====================State URL========================
export const GET_ALL_STATE = `${BASE_API_URL}/State/GetStateWebList` //Get State Page
export const POST_ALL_STATE = `${BASE_API_URL}/State/AddStateDetails` //Create State Page
export const STATE_DATA_BY_STATE_ID = `${BASE_API_URL}/State/GetStateByStateID` //Update State Page
export const UPDATE_STATE = `${BASE_API_URL}/State/UpdateStateDetails` //Update State Page
export const DELETE_STATE = `${BASE_API_URL}/State/PostDeleteState` //Delete State Page
export const ISACTIVE_STATE = `${BASE_API_URL}/State/UpdateStateIsactive` //Is Active State Page
export const GET_STATE_BY_COUNTRY_ID = `${BASE_API_URL}/State/GetStateByCountryID` //Is Active State Page

// ==================GET STATE============================
export function getAllState() {
  return axios.get(GET_ALL_STATE)
}

// ===============CREATE STATE============================

export function createState(
  countryID: number,
  stateMaster: string,
  isActive: boolean,
  createBy: number,
  ipAddress: string
) {
  return axios.post(POST_ALL_STATE, {countryID, stateMaster, isActive, createBy, ipAddress})
}
// ==============UPDATE STATE============================
export function getStateByStateId(stateID: string) {
  return axios.post(STATE_DATA_BY_STATE_ID, {stateID})
}
export function updateState(
  countryID: number,
  stateID: number,
  stateMaster: string,
  isActive: boolean,
  updateBy: number,
  ipAddress: string
) {
  return axios.post(UPDATE_STATE, {countryID, stateID, stateMaster, isActive, updateBy, ipAddress})
}
// ==============DELETE STATE=================
export function deleteState(stateId: number) {
  return axios.post(DELETE_STATE, {stateId})
}
// =======================ISACTIVE STATE==================
export function isActiveState(stateID: number, isActive: boolean) {
  return axios.post(ISACTIVE_STATE, {stateID, isActive})
}

export function getStateByCountryId(countryID: number) {
  return axios.post(GET_STATE_BY_COUNTRY_ID, {countryID})
}
