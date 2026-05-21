import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL
// =================Department URL=====================
export const GET_ALL_DEPARTMENT = `${BASE_API_URL}/Department_New/GetDepartmentWebList` //Get Department
export const GET_DROPDOWN_DEPARTMENT_LIST = `${BASE_API_URL}/Department_New/GetDropDownDepartmentList` //Get Dropdown Department
export const POST_CREATE_DEPARTMENT = `${BASE_API_URL}/Department_New/AddDepartmentDetails` //Create Department
export const DEPARTMENT_DATA_BY_DEPARTMENT_ID = `${BASE_API_URL}/Department_New/GetDepartmentByDepartmentID` //Update
export const UPDATE_DEPARTMENT = `${BASE_API_URL}/Department_New/UpdateDepartmentDetails` //Update
export const DELETE_DEPARTMENT = `${BASE_API_URL}/Department_New/PostDeleteDepartment` //Delete Departmen
export const ISACTIVE_DEPARTMENT = `${BASE_API_URL}/Department_New/UpdateDepartmentIsactive` //IsActive Departmen

// =========================Get Department=====================
export function getAllDepartmentData() {
  return axios.get(GET_ALL_DEPARTMENT)
}
// =========================Get Department=====================
export function getDropDownDepartmentData() {
  return axios.get(GET_DROPDOWN_DEPARTMENT_LIST)
}
// ===================Create Department========================
export function createDepartment(encodedReq: string
) {
  return axios.post(POST_CREATE_DEPARTMENT, {encodedReq
  })
}
// =======================Update Department========================
export function getDepartment(encodedReq: string) {
  return axios.post(DEPARTMENT_DATA_BY_DEPARTMENT_ID, {encodedReq})
}
export function updateDepartment(encodedReq: string
) {
  return axios.post(UPDATE_DEPARTMENT, {encodedReq
  })
}
// =======================Delete Department========================
export function deleteDeparment(encodedReq: string) {
  return axios.post(DELETE_DEPARTMENT, {encodedReq})
}
// ====================IsActive Department====================
export function isActiveDepartment(encodedReq: string) {
  return axios.post(ISACTIVE_DEPARTMENT, {encodedReq})
}
