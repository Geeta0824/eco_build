import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL
// =================TDS URL=====================
export const Add_TDS_PAY = `${BASE_API_URL}/TDS/AddTDSDetails`
export const GET_TDS_Pay_LIST = `${BASE_API_URL}/TDS/GetTDSPayList`
export const Delete_TDS_Detail = `${BASE_API_URL}/TDS/DeleteTDSDetail`
export const Update_TDS_Details = `${BASE_API_URL}/TDS/UpdateTDSDetails`
export const Get_TDSPay_Detail_ByID = `${BASE_API_URL}/TDS/GetTDSPayDetailByID`
export const GET_TDS_BREAKUP = `${BASE_API_URL}/TDS/GetTDSBreakup`

export function AddTDSPayApi(
  tdsPayDate: string,
  tdsAmount: number,
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
  tdsYear: number,
  tdsMonth: number,
  createBy: number,
  ipAddress: string
) {
  return axios.post(Add_TDS_PAY, {
    tdsPayDate,
    tdsAmount,
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
    tdsYear,
    tdsMonth,
    createBy,
    ipAddress,
  })
}

export function getTDSPayList() {
  return axios.get(GET_TDS_Pay_LIST)
}

export function UpdateTDSDetailsAPI(
  tdsPaymentID: number,
  tdsPayDate: string,
  tdsAmount: number,
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
  tdsYear: number,
  tdsMonth: number,
  updateBy: number,
  ipAddress: string
) {
  return axios.post(Update_TDS_Details, {
    tdsPaymentID,
    tdsPayDate,
    tdsAmount,
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
    tdsYear,
    tdsMonth,
    updateBy,
    ipAddress,
  })
}
export function GetTDSByTDSPaymentIDAPI(tdsPaymentID: number) {
  return axios.post(Get_TDSPay_Detail_ByID, {tdsPaymentID})
}

export function DeleteTDSDetailAPI(tdsPaymentID: number) {
  return axios.post(Delete_TDS_Detail, {tdsPaymentID})
}

export function GetTDSBreakupData(tdsYear: number, tdsMonth: number) {
  return axios.post(GET_TDS_BREAKUP, {tdsYear, tdsMonth})
}
