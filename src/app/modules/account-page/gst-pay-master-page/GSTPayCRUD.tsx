import axios from 'axios'
import {number} from 'yup'
const BASE_API_URL = process.env.REACT_APP_API_URL
// =================Change Password=====================
export const GET_GST_Breakup_List = `${BASE_API_URL}
/GST/GetGSTBreakupList`
export const Add_GST_Details = `${BASE_API_URL}
/GST/AddGstDetails`
export const GET_GST_Pay_LIST = `${BASE_API_URL}
/GST/GetGSTPayList`
export const DELETE_GST_DETAILS = `${BASE_API_URL}
/GST/DeleteGSTDetail`
export const UPDATE_GST_DETAILS = `${BASE_API_URL}
/GST/UpdateGSTDetails`
export const GET_GST_PAY_DETAILS_BY_ID = `${BASE_API_URL}
/GST/GetGSTPayDetailByID`

// -----------------------------
export function getGSTBreakupListApi(tdsYear: number,tdsMonth: number) {
  return axios.post(GET_GST_Breakup_List, {tdsYear,tdsMonth})
}
export function createGstDetailsApi(
  gstPayDate: string,
  gstAmount: number,
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
  description: string,
  documentPath: string,
  referenceNo: string,
  gstYear: number,
  gstMonth: number
) {
  return axios.post(Add_GST_Details, {
    gstPayDate,
    gstAmount,
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
    description,
    documentPath,
    referenceNo,
    gstYear,
    gstMonth
  })
}

export function getGSTPayList() {
  return axios.get(GET_GST_Pay_LIST)
}

export function deleteGstDetails(gstPaymentID: number) {
  return axios.post(DELETE_GST_DETAILS, {gstPaymentID})
}
export function updateGstDetails(
  gstPaymentID:number,
  gstPayDate: string,
  gstAmount: number,
  cashAccountID: number,
  transactionModeID: number,
  transactionID: string,
  chequeBankName: string,
  chequeBankBranch: string,
  chequeDate: string,
  chequeAmount: number,
  chequeNumber: string,
  cashAccountBankID: number,
  description: string,
  documentPath: string,
  referenceNo: string,
  gstYear: number,
  gstMonth: number,
  updateBy: number,
  ipAddress: string
) {
  return axios.post(UPDATE_GST_DETAILS, {
    gstPaymentID,
    gstPayDate,
    gstAmount,
    cashAccountID,
    transactionModeID,
    transactionID,
    chequeBankName,
    chequeBankBranch,
    chequeDate,
    chequeAmount,
    chequeNumber,
    cashAccountBankID,
    description,
    documentPath,
    referenceNo,
    gstYear,
    gstMonth,
    updateBy,
    ipAddress,
  })
}
export function getGSTPayByGSTPayID(gstPaymentID: number) {
  return axios.post(GET_GST_PAY_DETAILS_BY_ID, {gstPaymentID})
}
