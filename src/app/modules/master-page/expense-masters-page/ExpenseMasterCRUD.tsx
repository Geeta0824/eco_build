import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL
// =================Kyc Document URL=====================
export const GET_EXPENSE_MASTERS_LIST = `${BASE_API_URL}/ExpenseMasters/GetExpenseMastersWebList`
export const ADd_EXPENSE_MASTERS_DETAILS = `${BASE_API_URL}/ExpenseMasters/AddExpenseMastersDetails`
export const UPDATE_EXPENSE_MASTERS_DETAILS = `${BASE_API_URL}/ExpenseMasters/UpdateExpenseMasterDetails`
export const GET_EXPENSE_MASTERS_BY_EXPENSEMASTERS_ID = `${BASE_API_URL}/ExpenseMasters/GetExpenseMastersDataByExpenseMastersID`
export const DELETE_EXPENSE_MASTERS = `${BASE_API_URL}/ExpenseMasters/PostDeleteExpenseMasters`
export const GET_EXPENSE_Report_By_Expense_Type_ID = `${BASE_API_URL}/ExpenseMasters/GetExpenseReportByExpenseTypeID`
// export const GET_EXPENSE_TYPE_LIST = `${BASE_API_URL}/ExpenseMasters/GetExpenseMastersWebList`
export function getExpenseReportByFilter(
  expenseTypeID: number,
  searchText: string,
  startDate: string,
  endDate: string
) {
  return axios.post(GET_EXPENSE_Report_By_Expense_Type_ID, {
    expenseTypeID,
    searchText,
    startDate,
    endDate,
  })
}
export function getExpenseMastersList() {
  return axios.get(GET_EXPENSE_MASTERS_LIST)
}
export function addExpenseMasters(
  expenseTypeID: number,
  title: string,
  expenseDate: string,
  documentPath: string,
  amount: number,
  createBy: number,
  ipAddress: string,
  cashAccountID: number,
  transactionModeID: number,
  transactionID: string,
  chequeBankName: string,
  chequeBankBranch: string,
  chequeDate: string,
  chequeAmount: number,
  chequeNumber: string,
  cashAccountBankID: number,
  vendorInvoiceNo: string,
  employeeID: number,
  isgst: boolean,
  gstTypeID: number,
  cgstVal: number,
  sgstVal: number,
  igstVal: number,
  gstAmount: number,
  sgstPer: number,
  cgstPer: number,
  igstPer: number,
  isTdsDeduct: boolean,
  tdsPer: number,
  tdsAmount: number,
  afterTDSAmt: number,
  afterGSTAmount: number,
  finalAmount: number
) {
  return axios.post(ADd_EXPENSE_MASTERS_DETAILS, {
    expenseTypeID,
    title,
    expenseDate,
    documentPath,
    amount,
    createBy,
    ipAddress,
    cashAccountID,
    transactionModeID,
    transactionID,
    chequeBankName,
    chequeBankBranch,
    chequeDate,
    chequeAmount,
    chequeNumber,
    cashAccountBankID,
    vendorInvoiceNo,
    employeeID,
    isgst,
    gstTypeID,
    cgstVal,
    sgstVal,
    igstVal,
    gstAmount,
    sgstPer,
    cgstPer,
    igstPer,
    isTdsDeduct,
    tdsPer,
    tdsAmount,
    afterTDSAmt,
    afterGSTAmount,
    finalAmount,
  })
}

export function updateExpenseMasters(
  expenseMastersID: number,
  expenseTypeID: number,
  title: string,
  expenseDate: string,
  documentPath: string,
  amount: number,
  updateBy: number,
  ipAddress: string,
  cashAccountID: number,
  transactionModeID: number,
  transactionID: string,
  chequeBankName: string,
  chequeBankBranch: string,
  chequeDate: string,
  chequeAmount: number,
  chequeNumber: string,
  cashAccountBankID: number,
  vendorInvoiceNo: string,
  employeeID: number,
  isgst: boolean,
  gstTypeID: number,
  cgstVal: number,
  sgstVal: number,
  igstVal: number,
  gstAmount: number,
  sgstPer: number,
  cgstPer: number,
  igstPer: number,
  isTdsDeduct: boolean,
  tdsPer: number,
  tdsAmount: number,
  afterTDSAmt: number,
  afterGSTAmount: number,
  finalAmount: number
) {
  return axios.post(UPDATE_EXPENSE_MASTERS_DETAILS, {
    expenseMastersID,
    expenseTypeID,
    title,
    expenseDate,
    documentPath,
    amount,
    updateBy,
    ipAddress,
    cashAccountID,
    transactionModeID,
    transactionID,
    chequeBankName,
    chequeBankBranch,
    chequeDate,
    chequeAmount,
    chequeNumber,
    cashAccountBankID,
    vendorInvoiceNo,
    employeeID,
    isgst,
    gstTypeID,
    cgstVal,
    sgstVal,
    igstVal,
    gstAmount,
    sgstPer,
    cgstPer,
    igstPer,
    isTdsDeduct,
    tdsPer,
    tdsAmount,
    afterTDSAmt,
    afterGSTAmount,
    finalAmount,
  })
}
export function getExpenseMastersByExpenseMastersId(expenseMastersID: number) {
  return axios.post(GET_EXPENSE_MASTERS_BY_EXPENSEMASTERS_ID, {expenseMastersID})
}

export function deleteExpenseMastersData(expenseMastersID: number) {
  return axios.post(DELETE_EXPENSE_MASTERS, {expenseMastersID})
}
