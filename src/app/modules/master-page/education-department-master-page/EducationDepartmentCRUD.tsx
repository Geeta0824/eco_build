import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL
//=====================EduDepartment URL======================
export const GET_ALL_EDU_DEPARTMENT = `${BASE_API_URL}/EduDepartment/GetEduDepartmentWebList` //Get EduDepartment Page
export const POST_ADD_EDU_DEPARTMENT = `${BASE_API_URL}/EduDepartment/AddEduDepartmentDetails` //Create EduDepartment Page
export const EDU_DEPARTMENT_DATA_BY_EDU_DEPARTMENT_ID = `${BASE_API_URL}/EduDepartment/GetEduDepartmentByEduDepartmentID` //Update EduDepartment Page
export const UPDATE_EDU_DEPARTMENT = `${BASE_API_URL}/EduDepartment/UpdateEduDepartmentDetails` //Update EduDepartment Page
export const DELETE_EDU_DEPARTMENT = `${BASE_API_URL}/EduDepartment/PostDeleteEduDepartment` //Delete EduDepartment Page
export const ISACTIVE_EDU_DEPARTMENT = `${BASE_API_URL}/EduDepartment/UpdateEduDepartmentIsactive` // Is Active EduDepartment Page
export const GET_DROP_DOWN_EDU_DEPARTMENT = `${BASE_API_URL}/EduDepartment/GetEduDepartmentDropdownList` // Is Active EduDepartment Page

// =========GET EduDepartment=================================
export function getAllEduDepartment() {
  return axios.get(GET_ALL_EDU_DEPARTMENT)
}
// =========GET EduDepartment=================================
export function getDropDownEduDepartment() {
  return axios.get(GET_DROP_DOWN_EDU_DEPARTMENT)
}
// =====================CREATE EduDepartment===================
export function postEduDepartment(
  EduDepartmentName: string,
  isActive: boolean,
  createBy: number,
  ipAddress: string
) {
  return axios.post(POST_ADD_EDU_DEPARTMENT, {
    EduDepartmentName,
    isActive,
    createBy,
    ipAddress,
  })
}
// =======================UPDATE EduDepartment==================
export function getEduDepartmentById(EduDepartmentID: string) {
  return axios.post(EDU_DEPARTMENT_DATA_BY_EDU_DEPARTMENT_ID, {EduDepartmentID})
}

export function updateEduDepartment(
  EduDepartmentID: number,
  EduDepartmentName: string,
  isActive: boolean,
  updateBy: number,
  ipAddress: string
) {
  return axios.post(UPDATE_EDU_DEPARTMENT, {
    EduDepartmentID,
    EduDepartmentName,
    isActive,
    updateBy,
    ipAddress,
  })
}
// =======================DELETE EduDepartment==================
export function deleteEduDepartment(EduDepartmentID: number) {
  return axios.post(DELETE_EDU_DEPARTMENT, {EduDepartmentID})
}
// =======================ISACTIVE EduDepartment==================
export function isActiveEduDepartment(EduDepartmentID: number, isActive: boolean) {
  return axios.post(ISACTIVE_EDU_DEPARTMENT, {EduDepartmentID, isActive})
}
