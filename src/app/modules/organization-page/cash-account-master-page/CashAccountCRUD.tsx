import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL

//=====================Customer URL======================
export const GET_CASH_ACCOUNT_LIST = `${BASE_API_URL}/CashAccount/GetCashAccountList`
export const ADD_CASH_ACCOUNT = `${BASE_API_URL}/CashAccount/AddCashAccount`
export const EDIT_CASH_ACCOUNT = `${BASE_API_URL}/CashAccount/UpdateCashAccount`
export const GET_CASH_ACCOUNT_BY_CASH_ACCOUNT_ID = `${BASE_API_URL}/CashAccount/GetCashAccountByCashAccountID`
export const DELETE_CASH_ACCOUNT = `${BASE_API_URL}/CashAccount/DeleteCashAccount`
export const ISACTIVE_CASH_ACCOUNT = `${BASE_API_URL}/CashAccount/UpdateCashAccountIsactive`
export const GET_ORGANIZATION_BANK_DROPDOWN_LIST = `${BASE_API_URL}/OrganisationBank/GetDropDownOrganisationBankList`
export const GET_CASHACCOUNT_SEGMENT_LIST = `${BASE_API_URL}/CashAccount/GetCashAccountSegmentList`
export const UPDATE_CASHACCOUNT_SEGMENT_DETAILS = `${BASE_API_URL}/CashAccount/UpdateCashSegmentAccount`
export const ADD_CASHACCOUNT_SEGMENT_DETAILS = `${BASE_API_URL}/CashAccount/AddCashSegmentAccount`
export const DELETE_CASHACCOUNT_SEGMENT_DETAILS = `${BASE_API_URL}/CashAccount/DeleteCashAccountSegment`
export const GET_CASHACCOUNT_SEGMENT_BY_ID = `${BASE_API_URL}/CashAccount/GetCashAccountSegmentByID`
export const GET_CASH_SUB_ACCOUNT_BY_ID = `${BASE_API_URL}/CashAccount/GetCashSubAccountByID`
export const Get_Multi_Drop_down_For_Cash_Account = `${BASE_API_URL}/MultipleDropdownList/GetCash_Accountt_DropdownList_ForDropdown`

export function getMultiDropdownForCashAccountApi() {
  return axios.get(Get_Multi_Drop_down_For_Cash_Account)
}

export function GetCashAccountListAPI() {
  return axios.get(GET_CASH_ACCOUNT_LIST)
}
export function AddCashAccountDetailsAPI(
  employeeID: number,
  cashAccountRoleID: number,
  organisationBankID: number,
  cashAccountTypeID: number,
  accountBalance: string,
  isActive: boolean,
  createBy: number,
  ipAddress: string
) {
  return axios.post(ADD_CASH_ACCOUNT, {
    employeeID,
    cashAccountRoleID,
    organisationBankID,
    cashAccountTypeID,
    accountBalance,
    isActive,
    createBy,
    ipAddress,
  })
}
export function GetCashAccountDataByCashAccountIDAPI(cashAccountID: number) {
  return axios.post(GET_CASH_ACCOUNT_BY_CASH_ACCOUNT_ID, {cashAccountID})
}
export function UpdateCashAccountDetailsAPI(
  cashAccountID: number,
  employeeID: number,
  cashAccountRoleID: number,
  organisationBankID: number,
  cashAccountTypeID: number,
  accountBalance: string,
  isActive: boolean,
  updateBy: number,
  ipAddress: string
) {
  return axios.post(EDIT_CASH_ACCOUNT, {
    cashAccountID,
    employeeID,
    cashAccountRoleID,
    organisationBankID,
    cashAccountTypeID,
    accountBalance,
    isActive,
    updateBy,
    ipAddress,
  })
}
export function DeleteCashAccountAPI(cashAccountID: number) {
  return axios.post(DELETE_CASH_ACCOUNT, {cashAccountID})
}
export function IsActiveCashAccountAPI(cashAccountID: number, isActive: boolean) {
  return axios.post(ISACTIVE_CASH_ACCOUNT, {cashAccountID, isActive})
}
export function GetOrganizationBankDropdpwnAPI() {
  return axios.get(GET_ORGANIZATION_BANK_DROPDOWN_LIST)
}
// -----CashAccountSegmnetAPI---------

export function GetCashAccountSegmentList(cashAccountID: number) {
  return axios.post(GET_CASHACCOUNT_SEGMENT_LIST, {
    cashAccountID,
  })
}

export function UpdateCashSegmentAccount(
  cashEmployeeBalanceID: number,
  cashAccountID: number,
  emplyeeID: number,
  cashEmployeeSubTypeID: number,
  employeeBankID: number,
  accountBalance: number,
  createBy: number,
  ipAddress: string
) {
  return axios.post(UPDATE_CASHACCOUNT_SEGMENT_DETAILS, {
    cashEmployeeBalanceID,
    cashAccountID,
    emplyeeID,
    cashEmployeeSubTypeID,
    employeeBankID,
    accountBalance,
    createBy,
    ipAddress,
  })
}

export function AddCashSegmentAccount(
  cashAccountID: number,
  emplyeeID: number,
  cashEmployeeSubTypeID: number,
  employeeBankID: number,
  accountBalance: number,
  createBy: number,
  ipAddress: string
) {
  return axios.post(ADD_CASHACCOUNT_SEGMENT_DETAILS, {
    cashAccountID,
    emplyeeID,
    cashEmployeeSubTypeID,
    employeeBankID,
    accountBalance,
    createBy,
    ipAddress,
  })
}
export function DeleteCashAccountSegment(cashEmployeeBalanceID: number) {
  return axios.post(DELETE_CASHACCOUNT_SEGMENT_DETAILS, {
    cashEmployeeBalanceID,
  })
}
export function GetCashAccountSegmentByID(cashEmployeeBalanceID: number) {
  return axios.post(GET_CASHACCOUNT_SEGMENT_BY_ID, {
    cashEmployeeBalanceID,
  })
}

export function GetCashSubAccountByID(cashAccountID: number) {
  return axios.post(GET_CASH_SUB_ACCOUNT_BY_ID, {
    cashAccountID,
  })
}
