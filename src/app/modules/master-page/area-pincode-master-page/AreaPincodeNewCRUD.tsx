import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL
//=====================Area URL=========================
export const GET_AREA_PINCODE_new = `${BASE_API_URL}/AreaPincode_New/AreaPincode_GetList` //Get List
export const City_GetList = `${BASE_API_URL}/City/City_GetList` //City DropDown
export const GET_CITY_DROPDOWN_new = `${BASE_API_URL}/City_New/City_GetBy_StateID` //City DropDown
export const ADD_AREA_PINCODE_New = `${BASE_API_URL}/AreaPincode_New/AreaPincode_Add` //Add
export const UPDATE_AREA_PINCODE_new = `${BASE_API_URL}/AreaPincode_New/AreaPincode_Update` //Update
export const GET_BY_ID_AREA_PINCODE_new = `${BASE_API_URL}/AreaPincode_New/AreaPincode_GetBy_AreaPincodeID` //GetBy ID
export const IS_ACTIVE_AREA_PINCODE_new = `${BASE_API_URL}/AreaPincode_New/AreaPincode_Update_IsActive` //isActive
export const DELETE_AREA_PINCODE_new = `${BASE_API_URL}/AreaPincode_New/AreaPincode_Delete` //delete
export const AreaPincode_GetList_Pagination = `${BASE_API_URL}/AreaPincode_New/AreaPincode_GetList_Pagination` //delete

// ============================================================================
export function getAreaPincodeApi_New() {
  return axios.get(GET_AREA_PINCODE_new)
}

export function getAreaPincode_GetList_PaginationAPI(
  pageNumber: number,
  pageSize: number,
  searchText: string
) {
  return axios.post(AreaPincode_GetList_Pagination, {pageNumber, pageSize, searchText})
}

// ============================================================================
export function City_GetListApi() {
  return axios.get(City_GetList)
}
// ===========================================================================
export function getCityDropDownByStateID_new(encodedResponse: string) {
  return axios.post(GET_CITY_DROPDOWN_new, {encodedResponse})
}
// ============================================================================
export function createAreaPincode_New(encodedResponse: string) {
  return axios.post(ADD_AREA_PINCODE_New, {
    encodedResponse,
  })
}

// ==============================================================================
export function updateAreaPinCodeApi_new(encodedResponse: string) {
  return axios.post(UPDATE_AREA_PINCODE_new, {
    encodedResponse,
  })
}
// ====================================================================================
export function getAreaPinCodeByAreaPincodeID_new(encodedResponse: string) {
  return axios.post(GET_BY_ID_AREA_PINCODE_new, {encodedResponse})
}
// ====================================================================================
export function DeleteAreaPinCode_new(encodedResponse: string) {
  return axios.post(DELETE_AREA_PINCODE_new, {encodedResponse})
}
// ====================================================================================
export function isActiveAreaPinCode_new(encodedResponse: string) {
  return axios.post(IS_ACTIVE_AREA_PINCODE_new, {encodedResponse})
}
