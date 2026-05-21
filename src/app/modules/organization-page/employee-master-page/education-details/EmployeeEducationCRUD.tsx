import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL
// =================Emp Education URL=====================
export const GET_ALL_EMP_EDUCATION = `${BASE_API_URL}/EmployeeEducation/GetEmployeeEducationWebList`
export const CREATE_EMP_EDUCATION = `${BASE_API_URL}/EmployeeEducation/AddEmployeeEducationDetails`
export const UPDATE_EMP_EDUCATION_BY_EMP_EDUCATION_ID = `${BASE_API_URL}/EmployeeEducation/GetEmployeeEducationByEmployeeEducationID`
export const UPDATE_EMP_EDUCATION = `${BASE_API_URL}/EmployeeEducation/UpdateEmployeeEducationDetails`
export const DELETE_EMP_EDUCATION = `${BASE_API_URL}/EmployeeEducation/PostDeleteEmployeeEducation`
export const ISACTIVE_EMP_EDUCATION = `${BASE_API_URL}/EmployeeEducation/UpdateEmployeeEducationIsactive`
// export const GET_ALL_EMP_EDUCATION_BY_EMP_ID = `${BASE_API_URL}/EmployeeEducation/GetEmpEducationListByEmpID`
export const GET_ALL_EMP_EDUCATION_BY_EMP_ID = `${BASE_API_URL}/EmployeeEducation/GetEmpEduListByEmpID`

export function getAllEmpEducation() {
  return axios.get(GET_ALL_EMP_EDUCATION)
}

export function getAllEmpEducationByEmpID(employeeID: number) {
  return axios.post(GET_ALL_EMP_EDUCATION_BY_EMP_ID, {employeeID})
}

export function createEmpEducation(
  instituteName: string,
  subjectName: string,
  eduDepartmentID: Number,
  eduCategoryID: Number,
  employeeID: Number,
  passingYear: string,
  percentage: string,
  isActive: boolean,
  otherCategory: string
) {
  return axios.post(CREATE_EMP_EDUCATION, {
    instituteName,
    subjectName,
    eduDepartmentID,
    eduCategoryID,
    employeeID,
    passingYear,
    percentage,
    isActive,
    otherCategory,
  })
}
export function getEmpEducationById(EmployeeEducationID: string) {
  return axios.post(UPDATE_EMP_EDUCATION_BY_EMP_EDUCATION_ID, {EmployeeEducationID})
}
export function updateEmpEducation(
  employeeEducationID: number,
  instituteName: string,
  subjectName: string,
  eduDepartmentID: number,
  eduCategoryID: number,
  employeeID: number,
  passingYear: string,
  percentage: string,
  isActive: boolean,
  otherCategory: string
) {
  return axios.post(UPDATE_EMP_EDUCATION, {
    employeeEducationID,
    instituteName,
    subjectName,
    eduDepartmentID,
    employeeID,
    eduCategoryID,
    passingYear,
    percentage,
    isActive,
    otherCategory,
  })
}

export function deleteEmpEducation(EmployeeEducationID: number) {
  return axios.post(DELETE_EMP_EDUCATION, {EmployeeEducationID})
}

export function isActiveEmpEducation(EmployeeEducationID: number, isActive: boolean) {
  return axios.post(ISACTIVE_EMP_EDUCATION, {EmployeeEducationID, isActive})
}
