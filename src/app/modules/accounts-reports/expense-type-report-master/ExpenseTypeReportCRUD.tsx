import axios from 'axios'
import {number} from 'yup'
const BASE_API_URL = process.env.REACT_APP_API_URL
// =================Change Password=====================
// export const Add_Project_Fund_Recive = `${BASE_API_URL}/Fund/AddProjectFundReceive`
export const Get_ExpenseReport_ExpenseList = `${BASE_API_URL}/ExpenseMasters/GetExpenseReportByExpenseTypeID`
export const Get_Expense_ReportBy_ExpenseTypeID_ByGroup = `${BASE_API_URL}/ExpenseMasters/GetExpenseReportByExpenseTypeID_ByGroup`
export const GET_EXPENSE_TYPE_LIST = `${BASE_API_URL}/ExpenseType/GetExpenseTypeWebList`
export const GET_EXPENSE_HEADER_LIST = `${BASE_API_URL}/ExpenseMasters/GetExpenseHeaderReport_List`
export const GET_EXPENSE_HEADER_EXCEL_LIST = `${BASE_API_URL}/ExpenseMasters/GetExpenseHeaderReport_Excel`
export const GET_EXPENSE_TYPE_EXCEL_LIST = `${BASE_API_URL}/ExpenseMasters/GetExpense_ExcelReportByExpenseTypeID_Excel`
export const GET_EXPENSE_VIEW_EXCEL_LIST = `${BASE_API_URL}/ExpenseMasters/GetExpense_ExcelReportByID_Excel`

export function getExpenseTypeReportList(
  expenseTypeID: number,
  startDate: string,
  endDate: string
) {
  return axios.post(Get_ExpenseReport_ExpenseList, {expenseTypeID, startDate, endDate})
}

export function getExpenseTypeReportGroupByList(
  expenseTypeID: number,
  expenseHeadID: number,
  startDate: string,
  endDate: string
) {
  return axios.post(Get_Expense_ReportBy_ExpenseTypeID_ByGroup, {
    expenseTypeID,
    expenseHeadID,
    startDate,
    endDate,
  })
}

export function getExpenseHeadReportList(startDate: string, endDate: string) {
  return axios.post(GET_EXPENSE_HEADER_LIST, {startDate, endDate})
}

// -------------------- Header Excel --------------------
export function getExpenseHeadReportExcelList(startDate: string, endDate: string) {
  return axios.post(GET_EXPENSE_HEADER_EXCEL_LIST, {startDate, endDate})
}

// --------------------------- Expense Type ---------------------
export function getExpenseTypeReportGroupByExcelList(
  expenseTypeID: number,
  expenseHeadID: number,
  startDate: string,
  endDate: string
) {
  return axios.post(GET_EXPENSE_TYPE_EXCEL_LIST, {
    expenseTypeID,
    expenseHeadID,
    startDate,
    endDate,
  })
}

// --------------------------- Expense Type View Excel---------------------
export function getExpenseTypeReportViewExcelList(
  expenseTypeID: number,
  startDate: string,
  endDate: string
) {
  return axios.post(GET_EXPENSE_VIEW_EXCEL_LIST, {expenseTypeID, startDate, endDate})
}
