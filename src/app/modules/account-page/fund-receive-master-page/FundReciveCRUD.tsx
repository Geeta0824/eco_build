import axios from 'axios'
import {number} from 'yup'
const BASE_API_URL = process.env.REACT_APP_API_URL
// =================Change Password=====================
export const Add_Project_Fund_Recive = `${BASE_API_URL}/Fund/AddProjectFundReceive`
export const GET_Project_Fund_Recive_LIST = `${BASE_API_URL}/Fund/GetFundReceiveList`
export const UPDATE_Project_Fund_Recive = `${BASE_API_URL}/Fund/UpdateProjectFundReceive`
export const DELETE_Project_Fund_Recive = `${BASE_API_URL}/Fund/DeleteFundReceive`
export const GET_Fund_Recive_BY_FUND_RECEIVE_ID = `${BASE_API_URL}/Fund/GetFundReceiveByFundReceiveID`
export const GET_Project_Invoice_List_By_ProjectID_For_Pay_Fund = `${BASE_API_URL}/ProjectInvoice/GetProjectInvoiceListByProjectIDForPayFund`
export const Get_ProjectInvoice_ForFundRec_By_ProjectInvoiceID = `${BASE_API_URL}/ProjectInvoice/GetProjectInvoiceForFundRecByProjectInvoiceID`

export const GET_All_Project_DropDwn_LIST = `${BASE_API_URL}/Fund/GetAllProject_ForFundReceive`
export const Get_Fund_Receive_List_Filter = `${BASE_API_URL}/Fund/GetReceiveFundListFilter`
export const Excel_Get_Fund_Receive_List_Filter = `${BASE_API_URL}/Fund/Excel_GetReceiveFundListFilter`
//=====================================================
export function getAllProjectDropDwnList() {
  return axios.get(GET_All_Project_DropDwn_LIST)
}

export function getFundReceiveListFilterAPI(
  projectID: number,
  searchText: string,
  startDate: string,
  endDate: string
) {
  return axios.post(Get_Fund_Receive_List_Filter, {projectID, searchText, startDate, endDate})
}

export function getExcelFundReceiveListFilterAPI(
  projectID: number,
  searchText: string,
  startDate: string,
  endDate: string
) {
  return axios.post(Excel_Get_Fund_Receive_List_Filter, {projectID, searchText, startDate, endDate})
}

export function getProjectInvoiceListByProjectIDForPayFund(ProjectID: number) {
  return axios.post(GET_Project_Invoice_List_By_ProjectID_For_Pay_Fund, {ProjectID})
}

export function AddProjectFundReciveAPI(
  projectID: number,
  InvoiceID: number,
  paymentDate: string,
  amount: number,
  cashAccountID: number,
  transactionModeID: number,
  transactionID: string,
  chequeBankName: string,
  chequeBankBranch: string,
  chequeDate: string,
  chequeAmount: number,
  chequeNumber: string,
  cashAccountBankID: number,
  projectInvoiceNo: string,
  description: string,
  filePath: string,
  isTCS: boolean,
  tcsPer: number,
  tcsAmount: number,
  createBy: number,
  ipAddress: string
) {
  return axios.post(Add_Project_Fund_Recive, {
    projectID,
    InvoiceID,
    paymentDate,
    amount,
    cashAccountID,
    transactionModeID,
    transactionID,
    chequeBankName,
    chequeBankBranch,
    chequeDate,
    chequeAmount,
    chequeNumber,
    cashAccountBankID,
    projectInvoiceNo,
    description,
    filePath,
    isTCS,
    tcsPer,
    tcsAmount,
    createBy,
    ipAddress,
  })
}

export function GetFundReceiveList() {
  return axios.get(GET_Project_Fund_Recive_LIST, {})
}

export function UpdateProjectFundReceive(
  projectPaymentID: number,
  projectID: number,
  InvoiceID: number,
  paymentDate: string,
  amount: number,
  cashAccountID: number,
  transactionModeID: number,
  transactionID: string,
  chequeBankName: string,
  chequeBankBranch: string,
  chequeDate: string,
  chequeAmount: number,
  chequeNumber: string,
  cashAccountBankID: number,
  projectInvoiceNo: string,
  description: string,
  filePath: string,
  isTCS: boolean,
  tcsPer: number,
  tcsAmount: number,
  updateBy: number,
  ipAddress: string
) {
  return axios.post(UPDATE_Project_Fund_Recive, {
    projectPaymentID,
    projectID,
    InvoiceID,
    paymentDate,
    amount,
    cashAccountID,
    transactionModeID,
    transactionID,
    chequeBankName,
    chequeBankBranch,
    chequeDate,
    chequeAmount,
    chequeNumber,
    cashAccountBankID,
    projectInvoiceNo,
    description,
    filePath,
    isTCS,
    tcsPer,
    tcsAmount,
    updateBy,
    ipAddress,
  })
}
export function GetFundReceiveByFundReceiveID(projectPaymentID: number) {
  return axios.post(GET_Fund_Recive_BY_FUND_RECEIVE_ID, {
    projectPaymentID,
  })
}
export function DeleteFundReceive(projectPaymentID: number) {
  return axios.post(DELETE_Project_Fund_Recive, {
    projectPaymentID,
  })
}

export function GetProjectInvoiceForFundRecByProjectInvoiceID(projectInvoiceID: number) {
  return axios.post(Get_ProjectInvoice_ForFundRec_By_ProjectInvoiceID, {projectInvoiceID})
}
