import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL
// =================Kyc Document URL=====================
export const GET_EXPENSE_TYPE_LIST = `${BASE_API_URL}/ExpenseType/GetExpenseTypeWebList`
export const ADd_EXPENSE_TYPE_DETAILS = `${BASE_API_URL}/ExpenseType/AddExpenseTypeDetails`
export const UPDATE_EXPENSE_TYPE_DETAILS = `${BASE_API_URL}/ExpenseType/UpdateExpenseTypeDetails`
export const GET_EXPENSE_TYPE_BY_EXPENSE_TYPE_ID = `${BASE_API_URL}/ExpenseType/GetExpenseTypeDataByExpenseTypeID`
export const DELETE_EXPENSE_TYPE = `${BASE_API_URL}/ExpenseType/PostDeleteExpenseType`
export const EXPENSE_TYPE_ISACTIVE = `${BASE_API_URL}/ExpenseType/UpdateExpenseTypeIsactive`
export const EXPENSE_TYPE_BY_EXPENSE_HEADID = `${BASE_API_URL}/ExpenseType/GetExpenseTypeListByExpenseHeadID`

export function getExpenseTypeList() {
  return axios.get(GET_EXPENSE_TYPE_LIST)
}

export function GetExpenseTypeListByExpenseHeadIDList(expenseHeadID: number) {
  return axios.post(EXPENSE_TYPE_BY_EXPENSE_HEADID, {expenseHeadID})
}
export function addExpenseType(
  expenseTypeName: string,
  expenseHeadID: number,
  isActive: boolean,
  createBy: number,
  ipAddress: string
) {
  return axios.post(ADd_EXPENSE_TYPE_DETAILS, {
    expenseTypeName,
    expenseHeadID,
    isActive,
    createBy,
    ipAddress,
  })
}

export function updateExpenseType(
  expenseTypeID: number,
  expenseHeadID: number,
  expenseTypeName: string,
  isActive: boolean,
  createBy: number,
  ipAddress: string
) {
  return axios.post(UPDATE_EXPENSE_TYPE_DETAILS, {
    expenseTypeID,
    expenseHeadID,
    expenseTypeName,
    isActive,
    createBy,
    ipAddress,
  })
}

export function getExpenseTypeByExpenseTypeId(expenseTypeID: number) {
  return axios.post(GET_EXPENSE_TYPE_BY_EXPENSE_TYPE_ID, {expenseTypeID})
}

export function deleteExpenseTypeData(expenseTypeID: number) {
  return axios.post(DELETE_EXPENSE_TYPE, {expenseTypeID})
}
export function isActiveExpenseTypeData(expenseTypeID: number, isActive: boolean) {
  return axios.post(EXPENSE_TYPE_ISACTIVE, {expenseTypeID, isActive})
}
