import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL
// =================Kyc Document URL=====================
export const GET_EXPENSE_HEAD_LIST = `${BASE_API_URL}/ExpenseHead/GetExpenseHeadWebList`
export const ADd_EXPENSE_HEAD_DETAILS = `${BASE_API_URL}/ExpenseHead/AddExpenseHeadDetails`
export const UPDATE_EXPENSE_HEAD_DETAILS = `${BASE_API_URL}/ExpenseHead/UpdateExpenseHeadDetails`
export const GET_EXPENSE_HEAD_BY_EXPENSE_HEAD_ID = `${BASE_API_URL}/ExpenseHead/GetExpenseHeadDataByExpenseHeadID`
export const DELETE_EXPENSE_HEAD = `${BASE_API_URL}/ExpenseHead/PostDeleteExpenseHead`

export function getExpenseHeadList() {
  return axios.get(GET_EXPENSE_HEAD_LIST)
}
export function addExpenseHead(expenseHeadName: string, createBy: number, ipAddress: string) {
  return axios.post(ADd_EXPENSE_HEAD_DETAILS, {expenseHeadName, createBy, ipAddress})
}

export function updateExpenseHead(
  expenseHeadID: number,
  expenseHeadName: string,
  createBy: number,
  ipAddress: string
) {
  return axios.post(UPDATE_EXPENSE_HEAD_DETAILS, {
    expenseHeadID,
    expenseHeadName,
    createBy,
    ipAddress,
  })
}

export function getExpenseHeadByExpenseHeadId(expenseHeadID: number) {
  return axios.post(GET_EXPENSE_HEAD_BY_EXPENSE_HEAD_ID, {expenseHeadID})
}

export function deleteExpenseHeadData(expenseHeadID: number) {
  return axios.post(DELETE_EXPENSE_HEAD, {expenseHeadID})
}
