import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL
export const GET_ALL_DESIGNATION = `${BASE_API_URL}/Designation/GetDesignationWebList` //Get Designation
export const POST_CREATE_DESIGNATION = `${BASE_API_URL}/Designation/AddDesignationDetails` //Post Designation
export const DESIGNATION_DATA_BY_DESIGNATION_ID = `${BASE_API_URL}/Designation/GetDesignationByDesignationID` //Upd
export const UPDAT_DESIGNATION = `${BASE_API_URL}/Designation/UpdateDesignationDetails` //Update Designation
export const DELETE_DESIGNATION = `${BASE_API_URL}/Designation/PostDeleteDesignation` //Delete Designation
export const ISACTIVE_DESIGNATION = `${BASE_API_URL}/Designation/UpdateDesignationIsactive` //IsActive Desi
export const DESIGNATION_DROPDOWN_LIST = `${BASE_API_URL}/Designation/GetDropDownDesignationList` //Dropdown
export const DESIGNATION_DROPDOWN_LIST_BY_DEPARTMENT_ID = `${BASE_API_URL}/Designation/GetDesignationByDepartmentID` //Dropdown by department id

// ======================Get Designation=============================
export function getAllDesignation() {
  return axios.get(GET_ALL_DESIGNATION)
}
// ======================Get Designation=============================
export function GetDropDownDesignationList() {
  return axios.get(DESIGNATION_DROPDOWN_LIST)
}
// ======================Get Designation BY DEPARTMENT ID=============================
export function GetDesignationByDepartmentID(departmentID: number) {
  return axios.post(DESIGNATION_DROPDOWN_LIST_BY_DEPARTMENT_ID, {departmentID})
}
// ======================Create Designation==========================
export function createDesignation(
  designationName: string,
  departmentId: number,
  IsActive: boolean,
  UpdateBy: number,
  IPAddress: string
) {
  return axios.post(POST_CREATE_DESIGNATION, {
    designationName,
    departmentId,
    IsActive,
    UpdateBy,
    IPAddress,
  })
}
// ===========================Update Designation=======================
export function getDesignation(DesignationID: string) {
  return axios.post(DESIGNATION_DATA_BY_DESIGNATION_ID, {DesignationID})
}
export function updateDesignation(
  designationID: number,
  designationName: string,
  departmentId: number,
  isActive: boolean,
  updateBy: number,
  iPAddress: string
) {
  return axios.post(UPDAT_DESIGNATION, {
    designationID,
    designationName,
    departmentId,
    isActive,
    updateBy,
    iPAddress,
  })
}
// ===========================Delete Designation=======================
export function deleteDesignation(designationID: number) {
  return axios.post(DELETE_DESIGNATION, {designationID})
}

// ===========================IsActive Designation=======================
export function isActiveDesignation(designationID: number, isActive: boolean) {
  return axios.post(ISACTIVE_DESIGNATION, {designationID, isActive})
}
