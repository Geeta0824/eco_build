import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL
export const GET_ALL_DESIGNATION = `${BASE_API_URL}/Designation_New/GetDesignationWebList` //Get Designation
export const POST_CREATE_DESIGNATION = `${BASE_API_URL}/Designation_New/AddDesignationDetails` //Post Designation
export const DESIGNATION_DATA_BY_DESIGNATION_ID = `${BASE_API_URL}/Designation_New/GetDesignationByDesignationID` //Upd
export const UPDAT_DESIGNATION = `${BASE_API_URL}/Designation_New/UpdateDesignationDetails` //Update Designation
export const DELETE_DESIGNATION = `${BASE_API_URL}/Designation_New/PostDeleteDesignation` //Delete Designation
export const ISACTIVE_DESIGNATION = `${BASE_API_URL}/Designation_New/UpdateDesignationIsactive` //IsActive Desi
export const DESIGNATION_DROPDOWN_LIST = `${BASE_API_URL}/Designation_New/GetDropDownDesignationList` //Dropdown
export const DESIGNATION_DROPDOWN_LIST_BY_DEPARTMENT_ID = `${BASE_API_URL}/Designation_New/GetDesignationByDepartmentID` //Dropdown by department id

// ======================Get Designation=============================
export function getAllDesignation() {
  return axios.get(GET_ALL_DESIGNATION)
}
// ======================Get Designation=============================
export function GetDropDownDesignationList() {
  return axios.get(DESIGNATION_DROPDOWN_LIST)
}
// ======================Get Designation BY DEPARTMENT ID=============================
export function GetDesignationByDepartmentID(encodedReq: string) {
  return axios.post(DESIGNATION_DROPDOWN_LIST_BY_DEPARTMENT_ID, {encodedReq})
}
// ======================Create Designation==========================
export function createDesignation(encodedReq: string) {
  return axios.post(POST_CREATE_DESIGNATION, {encodedReq})
}
// ===========================Update Designation=======================
export function getDesignation(encodedReq: string) {
  return axios.post(DESIGNATION_DATA_BY_DESIGNATION_ID, {encodedReq})
}
export function updateDesignation(encodedReq: string) {
  return axios.post(UPDAT_DESIGNATION, {encodedReq})
}
// ===========================Delete Designation=======================
export function deleteDesignation(encodedReq: string) {
  return axios.post(DELETE_DESIGNATION, {encodedReq})
}

// ===========================IsActive Designation=======================
export function isActiveDesignation(encodedReq: string) {
  return axios.post(ISACTIVE_DESIGNATION, {encodedReq})
}
