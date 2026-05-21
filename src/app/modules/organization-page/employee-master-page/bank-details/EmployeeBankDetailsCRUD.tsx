import axios from 'axios'

const BASE_API_URL = process.env.REACT_APP_API_URL

//=====================EmpBankDetails URL======================
export const GET_ALL_EMP_BANK_DETAILS = `${BASE_API_URL}/EmployeeBankDtl/GetEmployeeBankDtlWebList`
export const CREATE_EMP_BANK_DETAILS = `${BASE_API_URL}/EmployeeBankDtl/AddEmployeeBankDtlDetails`
export const UPDATE_EMP_BANK_DETAILS = `${BASE_API_URL}/EmployeeBankDtl/UpdateEmployeeBankDtlDetails`
export const GET_EMP_BANK_DETAILS_BY_EMP_ID = `${BASE_API_URL}/EmployeeBankDtl/GetEmployeeBankDtlByEmployeeBankDtlID`
export const ISACTIVE_EMP_BANK_DETAILS = `${BASE_API_URL}/EmployeeBankDtl/UpdateEmployeeBankDtlIsactive`
export const DELETE_EMP_BANK_DETAILS = `${BASE_API_URL}/EmployeeBankDtl/PostDeleteEmployeeBankDtl`
export const GET_EMP_BANK_DETAILS_EMPID = `${BASE_API_URL}/EmployeeBankDtl/GetEmpBankDtlByEmpID`
export const GET_EMP_BANK_DETAILS_BY_EMPBANK_ID = `${BASE_API_URL}/EmployeeBankDtl/GetEmployeeBankDtlByEmployeeBankDtlID`

export function getAllEmpBankDetails() {
  return axios.get(GET_ALL_EMP_BANK_DETAILS)
}

export function getEmpBankDetailsByEmpID(employeeID: number) {
  return axios.post(GET_EMP_BANK_DETAILS_EMPID,{ employeeID })
}

export function createEmpBankDetails(
  employeeID: number,
  bankName: string,
  branchName: string,
  ifscCode: string,
  accountNumber: string,
  accountName: string,
  accountTypeID: number,
  pfaCompanyName: string,
  pfaunNumber: string,
  pfaNumber: string,
  esicNumber: string,
  esicStartDate: string,
  esicExpDate: string,
  pfaStartDate: string,
  pfaEndDate: string,
  isActive: boolean,
  createBy: number,
  ipAddress: string
) {
  return axios.post(CREATE_EMP_BANK_DETAILS, {
    employeeID,
    bankName,
    branchName,
    ifscCode,
    accountNumber,
    accountName,
    accountTypeID,
    pfaCompanyName,
    pfaunNumber,
    pfaNumber,
    esicNumber,
    esicStartDate,
    esicExpDate,
    pfaStartDate,
    pfaEndDate,
    isActive,
    createBy,
    ipAddress,
  })
}

export function getEmpBankDetByEmpId(employeeBankID: string) {
  return axios.post(GET_EMP_BANK_DETAILS_BY_EMP_ID, {employeeBankID})
}

export function updateEmpBankDetails(
  employeeBankID:number,
  employeeID: number,
  bankName: string,
  branchName: string,
  ifscCode: string,
  accountNumber: string,
  accountName: string,
  accountTypeID: number,
  pfaCompanyName: string,
  pfaunNumber: string,
  pfaNumber: string,
  esicNumber: string,
  esicStartDate: string,
  esicExpDate: string,
  pfaStartDate: string,
  pfaEndDate: string,
  isActive: boolean,
  updateBy: number,
  ipAddress: string
) {
  return axios.post(UPDATE_EMP_BANK_DETAILS, {
    employeeBankID,
    employeeID,
    bankName,
    branchName,
    ifscCode,
    accountNumber,
    accountName,
    accountTypeID,
    pfaCompanyName,
    pfaunNumber,
    pfaNumber,
    esicNumber,
    esicStartDate,
    esicExpDate,
    pfaStartDate,
    pfaEndDate,
    isActive,
    updateBy,
    ipAddress,
  })
}
export function isActiveEmpBankDetails(employeeBankID: number, isActive: boolean) {
  return axios.post(ISACTIVE_EMP_BANK_DETAILS, {employeeBankID, isActive})
}
export function deleteEmpBankDetails(employeeBankID: number) {
  return axios.post(DELETE_EMP_BANK_DETAILS, {employeeBankID})
}
export function getEmpBankDetailsByEmpBankIDApi(employeeBankID: number) {
  return axios.post(GET_EMP_BANK_DETAILS_BY_EMPBANK_ID,{ employeeBankID })
}