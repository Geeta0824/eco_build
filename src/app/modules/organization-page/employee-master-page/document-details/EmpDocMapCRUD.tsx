import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL
//=====================EmpDocMap URL======================
export const GET_ALL_EMP_DOC_MAP = `${BASE_API_URL}/EmployeeDocMap/GetEmployeeDocMapWebList`
export const CREATE_EMP_DOC_MAP = `${BASE_API_URL}/EmployeeDocMap/AddEmployeeDocMapDetails`
export const GET_EMP_DOC_MAP_BY_EMP_MAP_ID = `${BASE_API_URL}/EmployeeDocMap/GetEmployeeDocMapByEmployeeDocMapID`
export const UPDATE_EMP_DOC_MAP = `${BASE_API_URL}/EmployeeDocMap/UpdateEmployeeDocMapDetails`
export const ISACTIVE_EMP_DOC_MAP = `${BASE_API_URL}/EmployeeDocMap/UpdateEmployeeDocMapIsactive`
export const DELETE_EMP_DOC_MAP = `${BASE_API_URL}/EmployeeDocMap/PostDeleteEmployeeDocMap`
export const GET_EMP_DOC_MAP = `${BASE_API_URL}/EmployeeDocMap/GetEmpDocMapByEmpID`

export function getAllEmpDocMap() {
  return axios.get(GET_ALL_EMP_DOC_MAP)
}

export function getEmpDocMap(employeeID: number) {
  return axios.post(GET_EMP_DOC_MAP, {employeeID})
}

export function createEmpDocMap(
  employeeID: number,
  documentTypeID: number,
  docNumber: string,
  description: string,
  mediaTypeID: number,
  filePath: string,
  isActive: boolean,
  createBy: number,
  ipAddress: string
) {
  return axios.post(CREATE_EMP_DOC_MAP, {
    employeeID,
    documentTypeID,
    docNumber,
    description,
    mediaTypeID,
    filePath,
    isActive,
    createBy,
    ipAddress,
  })
}
export function getEmpDocMapByEmpDocMapId(employeeDocID: string) {
  return axios.post(GET_EMP_DOC_MAP_BY_EMP_MAP_ID, {employeeDocID})
}
export function updateEmpDocMap(
  employeeDocID: number,
  employeeID: number,
  documentTypeID: number,
  docNumber: string,
  description: string,
  mediaTypeID: number,
  filePath: string,
  isActive: boolean,
  updateBy: number,
  ipAddress: string
) {
  return axios.post(UPDATE_EMP_DOC_MAP, {
    employeeDocID,
    employeeID,
    documentTypeID,
    docNumber,
    description,
    mediaTypeID,
    filePath,
    isActive,
    updateBy,
    ipAddress,
  })
}
export function isActiveEmpDocMap(employeeDocID: number, isActive: boolean) {
  return axios.post(ISACTIVE_EMP_DOC_MAP, {employeeDocID, isActive})
}
export function deleteEmpDocMap(employeeDocID: number) {
  return axios.post(DELETE_EMP_DOC_MAP, {employeeDocID})
}
