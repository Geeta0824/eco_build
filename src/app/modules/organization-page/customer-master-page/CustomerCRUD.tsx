import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL

//=====================Customer URL======================
export const GET_CUSTOMER_DROP_DOWN = `${BASE_API_URL}/Customer/GetCustomerByTerminalCode` //Get Customer Page
export const GET_CUSTOMER = `${BASE_API_URL}/Customer/GetCustomerList` //Get Customer Page
export const GET_CUSTOMER_SEARCH_DROPDOWN = `${BASE_API_URL}/Customer/GetCustomerSearchDropDown` //Get Customer Page
export const GET_CUSTOMER_BY_B_ID = `${BASE_API_URL}/Customer/GetCustomerListByBranchID` //Get Customer Page
// export const GET_ALL_CUSTOMER_LIST = `${BASE_API_URL}/Customer/GetCustomerAllList` //Get Customer Page
export const ADD_CUSTOMER = `${BASE_API_URL}/Customer/AddNewCustomer` //Add Create Customer Page
export const GET_CUSTOMER_BY_CUSTOMER_ID = `${BASE_API_URL}/Customer/GetEmpByEmpID` //Get Create Customer Page
export const ISACTIVE_CUSTOMER = `${BASE_API_URL}/Customer/UpdateCustomerIsActive` //Get Customer Page
export const DELETE_CUSTOMER = `${BASE_API_URL}/Customer/DeleteCustomerData` //Get Customer Page
export const UPDATE_CUSTOMER_PERSONAL = `${BASE_API_URL}/Customer/UpdateCustomerPersonalDetails` // update Customer Personal Page
export const UPDATE_CUSTOMER_ADDRESS = `${BASE_API_URL}/Customer/UpdateCustomerAddress` // update Customer Address Page
export const UPDATE_CUSTOMER_TERMINAL = `${BASE_API_URL}/Customer/UpdateCustomerTerminal` // Update Customer Terminal Page

// ======================== Using Customer ID API========================
export const GET_PERSONAL_BY_CUSTOMER_ID = `${BASE_API_URL}/Customer/GetCustomerPersnolByCustomerID` //Get Customer Personal Page
export const GET_ADDRESS_BY_CUSTOMER_ID = `${BASE_API_URL}/Customer/GetCustomerAddressByCustomerID` //Get Customer Address Page
export const GET_TERMINAL_BY_CUSTOMER_ID = `${BASE_API_URL}/Customer/GetCustomerTerminalByCustomerID` //Get Customer Terminal Page
export const GET_CUSTOMER_LIST_BY_FILTER = `${BASE_API_URL}/Customer/GetCustomerListByFilter` //Get Customer Terminal Page
export const GetCustomerListByFilter_WithUserID = `${BASE_API_URL}/Customer/GetCustomerListByFilter_WithUserID` //Get Customer Terminal Page
export const GET_View_Customer_By_Customer_ID = `${BASE_API_URL}/Customer/ViewCustomerByCustomerID` //Get Customer Terminal Page

// *************************===========API FUNCTION================*******************************************
export function getViewCustomerByCustomerID(customerID: number) {
  return axios.post(GET_View_Customer_By_Customer_ID, {customerID})
}
export function getCustomerListByBranchID(branchID: number) {
  return axios.post(GET_CUSTOMER_BY_B_ID, {branchID})
}

export function getCustomerListByFilter(
  sortType: number,
  branchID: number,
  searchText: string,
  sortBy: number,
  terminalTypeID: number
) {
  return axios.post(GET_CUSTOMER_LIST_BY_FILTER, {
    sortType,
    branchID,
    searchText,
    sortBy,
    terminalTypeID,
  })
}

export function getCustomerListByFilterUserID(
  sortType: number,
  branchID: number,
  searchText: string,
  sortBy: number,
  terminalTypeID: number,
  userID: number
) {
  return axios.post(GetCustomerListByFilter_WithUserID, {
    sortType,
    branchID,
    searchText,
    sortBy,
    terminalTypeID,
    userID,
  })
}

export function getCustomerDropDownList() {
  return axios.get(GET_CUSTOMER_DROP_DOWN)
}

// ========================= Customer Search Dropdown =======================
export function getCustomerDropSearchDownList() {
  return axios.get(GET_CUSTOMER_SEARCH_DROPDOWN)
}

export function getCustomerList() {
  return axios.get(GET_CUSTOMER)
}
// export function getAllCustomerList() {
//   return axios.get(GET_ALL_CUSTOMER_LIST)
// }

export function addCustomerApi(
  terminalTypeID: number,
  branchID: number,
  terminalCode: string,
  firstName: string,
  middleName: string,
  lastName: string,
  email: string,
  mobileNumber: string,
  alternateMobNumber: string,
  phoneNumber: string,
  crmid: string,
  isActive: boolean,
  leadOwnerID: number,
  createBy: number,
  ipAddress: string
) {
  return axios.post(ADD_CUSTOMER, {
    terminalTypeID,
    branchID,
    terminalCode,
    firstName,
    middleName,
    lastName,
    email,
    mobileNumber,
    alternateMobNumber,
    phoneNumber,
    crmid,
    isActive,
    leadOwnerID,
    createBy,
    ipAddress,
  })
}

export function UpdateCustomerPersonalDetails(
  customerID: number,
  terminalTypeID: number,
  branchID: number,
  terminalCode: string,
  firstName: string,
  middleName: string,
  lastName: string,
  email: string,
  mobileNumber: string,
  alternateMobNumber: string,
  phoneNumber: string,
  crmid: string,
  isActive: boolean,
  leadOwnerID: number,
  updateBy: number,
  ipAddress: string
) {
  return axios.post(UPDATE_CUSTOMER_PERSONAL, {
    customerID,
    terminalTypeID,
    branchID,
    terminalCode,
    firstName,
    middleName,
    lastName,
    email,
    mobileNumber,
    alternateMobNumber,
    phoneNumber,
    crmid,
    isActive,
    leadOwnerID,
    updateBy,
    ipAddress,
  })
}

export function UpdateCustomerAddressDetails(
  customerID: number,
  address1: string,
  address2: string,
  pincode: string,
  cityName: string,
  // talukaName: string,
  talukaID: number,
  districtID: number,
  stateID: number,
  countryID: number,
  updateBy: number,
  ipAddress: string
) {
  return axios.post(UPDATE_CUSTOMER_ADDRESS, {
    customerID,
    address1,
    address2,
    pincode,
    cityName,
    // talukaName,
    talukaID,
    districtID,
    stateID,
    countryID,
    updateBy,
    ipAddress,
  })
}

export function getEmpByEmpeID(customerID: number) {
  return axios.post(GET_CUSTOMER_BY_CUSTOMER_ID, {customerID})
}

export function isActiveCustomer(customerID: number, isActive: boolean) {
  return axios.post(ISACTIVE_CUSTOMER, {customerID, isActive})
}
export function deleteCustomer(customerID: number) {
  return axios.post(DELETE_CUSTOMER, {customerID})
}

// =======================get data using Customer ID=======================

export function customerPersonalApi(customerID: number) {
  return axios.post(GET_PERSONAL_BY_CUSTOMER_ID, {customerID})
}

export function customerAddressApi(customerID: number) {
  return axios.post(GET_ADDRESS_BY_CUSTOMER_ID, {customerID})
}

export function customerTerminalApi(customerID: number) {
  return axios.post(GET_TERMINAL_BY_CUSTOMER_ID, {customerID})
}

// =========================Terminal========================
export function UpdateCustomerTerminalDetails(
  customerID: number,
  terminalTypeID: number,
  terminalCode: string,
  updateBy: number,
  ipAddress: string
) {
  return axios.post(UPDATE_CUSTOMER_TERMINAL, {
    customerID,
    terminalTypeID,
    terminalCode,
    updateBy,
    ipAddress,
  })
}
