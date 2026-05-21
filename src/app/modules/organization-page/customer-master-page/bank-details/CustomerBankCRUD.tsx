import axios from 'axios'

const BASE_API_URL = process.env.REACT_APP_API_URL

//=====================customerBank URL======================
export const GET_ALL_CUSTOMER_BANK = `${BASE_API_URL}/CustomerBank/GetCustomerBankWebList`
export const CREATE_CUSTOMER_BANK = `${BASE_API_URL}/CustomerBank/AddCustomerBankDetails`
export const UPDATE_CUSTOMER_BANK = `${BASE_API_URL}/CustomerBank/UpdateCustomerBankDetails`
export const GET_CUSTOMER_BANK_BY_CUSTOMER_ID = `${BASE_API_URL}/CustomerBank/GetCustomerBankByCustomerBankID`
export const ISACTIVE_CUSTOMER_BANK = `${BASE_API_URL}/CustomerBank/UpdateCustomerBankIsactive`
export const DELETE_CUSTOMER_BANK = `${BASE_API_URL}/CustomerBank/PostDeleteCustomerBank`
export const GET_CUSTOMER_BANK_CUSTOMERID = `${BASE_API_URL}/CustomerBank/GetCustomerBankByCustomerID`
// export const GET_DROP_DOWN_CUSTOMER_BANK = `${BASE_API_URL}/CustomerBank/GetDropDownCustomerBankList`

export function getAllCustomerBank() {
  return axios.get(GET_ALL_CUSTOMER_BANK)
}

export function getCustomerBankByCustomerID(customerID: number) {
  return axios.post(GET_CUSTOMER_BANK_CUSTOMERID, {customerID})
}

export function createCustomerBank(
  customerID: number,
  bankName: string,
  branchName: string,
  ifscCode: string,
  accountNumber: string,
  micrCode: string,
  bankAccountTypeID: number,
  isActive: boolean,
  createBy: number,
  ipAddress: string
) {
  return axios.post(CREATE_CUSTOMER_BANK, {
    customerID,
    bankName,
    branchName,
    ifscCode,
    accountNumber,
    micrCode,
    bankAccountTypeID,
    isActive,
    createBy,
    ipAddress,
  })
}

export function getCustomerBankDetByCustomerID(customerBankID: number) {
  return axios.post(GET_CUSTOMER_BANK_BY_CUSTOMER_ID, {customerBankID})
}

export function updateCustomerBank(
  customerBankID: number,
  customerID: number,
  bankName: string,
  branchName: string,
  ifscCode: string,
  accountNumber: string,
  micrCode: string,
  bankAccountTypeID: number,
  isActive: boolean,
  updateBy: number,
  ipAddress: string
) {
  return axios.post(UPDATE_CUSTOMER_BANK, {
    customerBankID,
    customerID,
    bankName,
    branchName,
    ifscCode,
    accountNumber,
    micrCode,
    bankAccountTypeID,
    isActive,
    updateBy,
    ipAddress,
  })
}
export function isActiveCustomerBank(customerBankID: number, isActive: boolean) {
  return axios.post(ISACTIVE_CUSTOMER_BANK, {customerBankID, isActive})
}
export function deleteCustomerBank(customerBankID: number) {
  return axios.post(DELETE_CUSTOMER_BANK, {customerBankID})
}
