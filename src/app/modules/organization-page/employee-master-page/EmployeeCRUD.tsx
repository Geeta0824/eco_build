import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL

//=====================Employee URL======================
export const GET_FILTER_EMPLOYEE = `${BASE_API_URL}/Employee/GetEmployeeListByFilter` //Get Filter Employee Page
export const GET_ALL_EMPLOYEE = `${BASE_API_URL}/Employee/GetEmployeeList` //Get Employee Page
export const GET_ALL_EMPLOYEE_WEB_LIST = `${BASE_API_URL}/Employee/GetEmployeeAllList` //Get Employee Page
export const ADD_EMPLOYEE = `${BASE_API_URL}/Employee/AddNewEmployee` //Add Create Employee Page
export const GET_EMPLOYEE_BY_EMPLOYEE_ID = `${BASE_API_URL}/Employee/GetEmpByEmpID` //Get Create Employee Page
export const ISACTIVE_EMPLOYEE = `${BASE_API_URL}/Employee/UpdateEmployeeIsActive` //Get Employee Page
export const DELETE_EMPLOYEE = `${BASE_API_URL}/Employee/DeleteEmployeeData` //Get Employee Page
export const UPDATE_EMPLOYEE_PERSONAL = `${BASE_API_URL}/Employee/UpdateEmployeePersonalDetails` // update employee Personal Page
export const UPDATE_EMPLOYEE_ADDRESS = `${BASE_API_URL}/Employee/UpdateEmployeeAddress` // update employee Address Page

// ======================== Using Employee ID API========================
export const GET_PERSONAL_BY_EMPLOYEE_ID = `${BASE_API_URL}/Employee/GetEmpPersnolByEmployeeID`
export const GET_PHOTO_BY_EMPLOYEE_ID = `${BASE_API_URL}/Employee/GetEmpPhotoByEmployeeID`
export const GET_ADDRESS_BY_EMPLOYEE_ID = `${BASE_API_URL}/Employee/GetEmpAddressByEmployeeID`
export const GET_EMPLOYEE_SEARCH_DROPDOWN = `${BASE_API_URL}/Employee/GetEmployeeSearchDropDown`
export const Employee_Get_SearchDropdown_ForUser = `${BASE_API_URL}/Employee/Employee_Get_SearchDropdown_ForUser`
export const Get_Multi_Drop_down_For_Employee = `${BASE_API_URL}/MultipleDropdownList/GetEmployee_DropdownList_ForDropdown`

export function getMultiDropdownForEmployeeApi() {
  return axios.get(Get_Multi_Drop_down_For_Employee)
}

export function getAllEmployeeList() {
  return axios.get(GET_ALL_EMPLOYEE)
}
export function getFilterEmployeeList(
  branchID: number,
  searchText: string,
  sortType: number,
  sortBy: number
) {
  return axios.post(GET_FILTER_EMPLOYEE, {
    branchID,
    searchText,
    sortType,
    sortBy,
  })
}
// ============================ Employee Search dropdown for user ===========================
export function getEmployeeSearchDropDown() {
  return axios.get(GET_EMPLOYEE_SEARCH_DROPDOWN)
}
// ============================ Employee Search dropdown for user ===========================
export function Employee_Get_SearchDropdown_ForUserApi() {
  return axios.get(Employee_Get_SearchDropdown_ForUser)
}
export function getAllEmployeeWebList() {
  return axios.get(GET_ALL_EMPLOYEE_WEB_LIST)
}

export function addEmployeeApi(
  branchID: number,
  departmentID: number,
  designationID: number,
  firstName: string,
  middleName: string,
  lastName: string,
  email: string,
  contactNumber: string,
  bloodGroupID: number,
  genderID: number,
  birthDate: string,
  nationalityID: number,
  roleID: number,
  anniversaryDate: string,
  joinDate: string,
  isActive: boolean,
  createBy: number,
  kylasID: number,
  ipAddress: string
) {
  return axios.post(ADD_EMPLOYEE, {
    branchID,
    departmentID,
    designationID,
    firstName,
    middleName,
    lastName,
    email,
    contactNumber,
    bloodGroupID,
    genderID,
    birthDate,
    nationalityID,
    roleID,
    anniversaryDate,
    joinDate,
    isActive,
    createBy,
    kylasID,
    ipAddress,
  })
}

export function UpdateEmployeePersonalDetails(
  employeeID: number,
  departmentID: number,
  designationID: number,
  branchID: number,
  firstName: string,
  middleName: string,
  lastName: string,
  email: string,
  contactNumber: string,
  bloodGroupID: number,
  genderID: number,
  birthDate: string,
  nationalityID: number,
  roleID: number,
  anniversaryDate: string,
  joinDate: string,
  isActive: boolean,
  updateBy: number,
  kylasID: number,
  ipAddress: string
) {
  return axios.post(UPDATE_EMPLOYEE_PERSONAL, {
    employeeID,
    departmentID,
    designationID,
    branchID,
    firstName,
    middleName,
    lastName,
    email,
    contactNumber,
    bloodGroupID,
    genderID,
    birthDate,
    nationalityID,
    roleID,
    anniversaryDate,
    joinDate,
    isActive,
    updateBy,
    kylasID,
    ipAddress,
  })
}

export function UpdateEmployeeAddressDetails(
  employeeID: number,
  perPincode: string,
  curntAddress1: string,
  curntAddress2: string,
  curntPincode: string,
  perPincodeCityName: string,
  curntPincodeCityName: string,
  perAddress1: string,
  perAddress2: string,
  perStateID: number,
  perCoutnryID: number,
  curntCityID: number,
  curntSateID: number,
  curntCountryID: number,
  perCityID: number,
  perTalukaID: number,
  curntTalukaID: number,
  updateBy: number,
  ipAddress: string
) {
  return axios.post(UPDATE_EMPLOYEE_ADDRESS, {
    employeeID,
    perPincode,
    curntAddress1,
    curntAddress2,
    curntPincode,
    perPincodeCityName,
    curntPincodeCityName,
    perAddress1,
    perAddress2,
    perCityID,
    perStateID,
    perCoutnryID,
    curntCityID,
    curntSateID,
    curntCountryID,
    perTalukaID,
    curntTalukaID,
    updateBy,
    ipAddress,
  })
}

export function getEmpByEmpeID(employeeID: number) {
  return axios.post(GET_EMPLOYEE_BY_EMPLOYEE_ID, {employeeID})
}

export function isActiveEmployee(employeeID: number, isActive: boolean) {
  return axios.post(ISACTIVE_EMPLOYEE, {employeeID, isActive})
}
export function deleteEmployee(employeeID: number) {
  return axios.post(DELETE_EMPLOYEE, {employeeID})
}

// =======================get data using Employee ID=======================

export function employeePersonalApi(employeeID: number) {
  return axios.post(GET_PERSONAL_BY_EMPLOYEE_ID, {employeeID})
}
export function employeePhotoApi(employeeID: number) {
  return axios.post(GET_PHOTO_BY_EMPLOYEE_ID, {employeeID})
}
export function employeeAddressApi(employeeID: number) {
  return axios.post(GET_ADDRESS_BY_EMPLOYEE_ID, {employeeID})
}
