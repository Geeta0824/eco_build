import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL
// =================Department URL=====================
export const GET_ALL_DEPARTMENT = `${BASE_API_URL}/Department/GetDepartmentWebList` //Get Department
export const GET_DROPDOWN_DEPARTMENT_LIST = `${BASE_API_URL}/Department/GetDropDownDepartmentList` //Get Dropdown Department
export const POST_CREATE_DEPARTMENT = `${BASE_API_URL}/Department/AddDepartmentDetails` //Create Department
export const DEPARTMENT_DATA_BY_DEPARTMENT_ID = `${BASE_API_URL}/Department/GetDepartmentByDepartmentID` //Update
export const UPDATE_DEPARTMENT = `${BASE_API_URL}/Department/UpdateDepartmentDetails` //Update
export const DELETE_DEPARTMENT = `${BASE_API_URL}/Department/PostDeleteDepartment` //Delete Departmen
export const ISACTIVE_DEPARTMENT = `${BASE_API_URL}/Department/UpdateDepartmentIsactive` //IsActive Departmen

// =========================Get Department=====================
export function getAllDepartmentData() {
  return axios.get(GET_ALL_DEPARTMENT)
}
// =========================Get Department=====================
export function getDropDownDepartmentData() {
  return axios.get(GET_DROPDOWN_DEPARTMENT_LIST)
}
// ===================Create Department========================
export function createDepartment(
  departmentName: string,
  departmentCode: string,
  photoPath: string,
  iconPath: string,
  isActive: boolean,
  createBy: number,
  ipAddress: string
) {
  return axios.post(POST_CREATE_DEPARTMENT, {
    departmentName,
    departmentCode,
    photoPath,
    iconPath,
    isActive,
    createBy,
    ipAddress,
  })
}
// =======================Update Department========================
export function getDepartment(DepartmentID: string) {
  return axios.post(DEPARTMENT_DATA_BY_DEPARTMENT_ID, {DepartmentID})
}
export function updateDepartment(
  departmentID: number,
  departmentName: string,
  departmentCode: string,
  photoPath: string,
  iconPath: string,
  isActive: boolean,
  updateBy: number,
  ipAddress: string
) {
  return axios.post(UPDATE_DEPARTMENT, {
    departmentID,
    departmentName,
    departmentCode,
    photoPath,
    iconPath,
    isActive,
    updateBy,
    ipAddress,
  })
}
// =======================Delete Department========================
export function deleteDeparment(DepartmentID: number) {
  return axios.post(DELETE_DEPARTMENT, {DepartmentID})
}
// ====================IsActive Department====================
export function isActiveDepartment(DepartmentID: number, isActive: boolean) {
  return axios.post(ISACTIVE_DEPARTMENT, {DepartmentID, isActive})
}
