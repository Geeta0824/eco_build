import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL
//=====================Area URL=========================
export const GET_AREA_PINCODE = `${BASE_API_URL}/AreaPincode/AreaPincode_GetList` //Get List
export const City_GetList = `${BASE_API_URL}/City/City_GetList` //City DropDown 
export const GET_CITY_DROPDOWN = `${BASE_API_URL}/City/City_GetBy_StateID` //City DropDown 
export const ADD_AREA_PINCODE = `${BASE_API_URL}/AreaPincode/AreaPincode_Add` //Add 
export const UPDATE_AREA_PINCODE = `${BASE_API_URL}/AreaPincode/AreaPincode_Update` //Update 
export const GET_BY_ID_AREA_PINCODE = `${BASE_API_URL}/AreaPincode/AreaPincode_GetBy_AreaPincodeID` //GetBy ID 
export const IS_ACTIVE_AREA_PINCODE = `${BASE_API_URL}/AreaPincode/AreaPincode_Update_IsActive`//isActive
export const DELETE_AREA_PINCODE = `${BASE_API_URL}/AreaPincode/AreaPincode_Delete`//delete

// ============================================================================
export function getAreaPincodeApi() {
  return axios.get(GET_AREA_PINCODE)
}

// ============================================================================
export function City_GetListApi() {
  return axios.get(City_GetList)
}
// ===========================================================================
export function getCityDropDownByStateID(stateID: number) {
  return axios.post(GET_CITY_DROPDOWN, {stateID})
}
// ============================================================================
export function createAreaPincode(
  stateID: number,
  cityID: number,
  areaName: string,
  pincode: string,
  isActive: boolean,
  createBy: number,
  ipAddress: string
) {
  return axios.post(ADD_AREA_PINCODE, {
    stateID,
    cityID,
    areaName,
    pincode,
    isActive,
    createBy,
    ipAddress,
  })
}

// ==============================================================================
export function updateAreaPinCodeApi(
  areaPincodeID: number,
  stateID: number,
  cityID: number,
  areaName: string,
  pincode: string,
  isActive: boolean,
  updateBy: number,
  ipAddress: string
) {
  return axios.post(UPDATE_AREA_PINCODE, {
    areaPincodeID,
    stateID,
    cityID,
    areaName,
    pincode,
    isActive,
    updateBy,
    ipAddress,
  })
}
// ====================================================================================
export function getAreaPinCodeByAreaPincodeID(areaPincodeID: number) {
  return axios.post(GET_BY_ID_AREA_PINCODE, {areaPincodeID})
}
// ====================================================================================
export function DeleteAreaPinCode(areaPincodeID: number) {
  return axios.post(DELETE_AREA_PINCODE, {areaPincodeID})
}
// ====================================================================================
export function isActiveAreaPinCode(areaPincodeID: number, isActive: boolean) {
  return axios.post(IS_ACTIVE_AREA_PINCODE, {areaPincodeID, isActive})
}
