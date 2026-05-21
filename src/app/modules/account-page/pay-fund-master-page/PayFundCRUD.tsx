import axios from 'axios'
import {number} from 'yup'
import {IFundProjectModel} from '../../../models/Accounts-page/pay-fund-page/IPayFundModel'
const BASE_API_URL = process.env.REACT_APP_API_URL
// =================Change Password=====================
export const Add_Project_Fund_PAY = `${BASE_API_URL}
/Fund/AddProjectFundPayToVendor`
export const AddProjectFundPayToVendorMultiple = `${BASE_API_URL}
/Fund/AddProjectFundPayToVendorMultiple`
export const GET_PAY_FUND_LIST = `${BASE_API_URL}
/Fund/GetPayFundList`
export const DELETE_PAY_FUND_DETAILS = `${BASE_API_URL}
/Fund/DeletePayFund`
export const UPDATE_PAY_FUND_DETAILS = `${BASE_API_URL}
/Fund/UpdateProjectFundPayDetails`
export const GET_PAY_FUND_BY_PROJECT_PAYMENT_ID = `${BASE_API_URL}
/Fund/GetPayFundByProjectPaymentID`
export const GET_Project_List_By_Vendor_ID = `${BASE_API_URL}
/Project/GetProjectListByVendorID`
export const Get_PayFund_List_Filter = `${BASE_API_URL}
/Fund/GetPayFundListFilter`
export const Excel_GetPay_FundList_Filter = `${BASE_API_URL}
/Fund/Excel_GetPayFundListFilter`
export const GetProjectListByVendorID_For_PayPayment = `${BASE_API_URL}
/Project/GetProjectListByVendorID_For_PayPayment`

// ============================================================
export function GetProjectListByVendorID(vendorID: number) {
  return axios.post(GET_Project_List_By_Vendor_ID, {vendorID})
}
// ==============================
export function AddProjectFundPayToVendor(
  projectVendorID: number,
  vendorID: number,
  projectID: number,
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
  vendorInvoiceNo: string,
  description: string,
  filePath: string,
  isTdsDeduct: boolean,
  isgst: boolean,
  gstTypeID: number,
  cgstVal: number,
  sgstVal: number,
  igstVal: number,
  gstAmount: number,
  tdsPer: number,
  createBy: number,
  ipAddress: string,
  tdsAmount: number,
  sgstPer: number,
  cgstPer: number,
  igstPer: number,
  afterTDSAmt: number,
  afterGSTAmount: number,
  finalAmount: number
) {
  return axios.post(Add_Project_Fund_PAY, {
    projectVendorID,
    vendorID,
    projectID,
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
    vendorInvoiceNo,
    description,
    filePath,
    isTdsDeduct,
    isgst,
    gstTypeID,
    cgstVal,
    sgstVal,
    igstVal,
    gstAmount,
    tdsPer,
    createBy,
    ipAddress,
    tdsAmount,
    sgstPer,
    cgstPer,
    igstPer,
    afterTDSAmt,
    afterGSTAmount,
    finalAmount,
  })
}
// ==============================
export function AddProjectFundPayToVendorMultipleApi(
  projectList: IFundProjectModel[],
  vendorID: number,
  // projectID: number,
  paymentDate: string,
  // amount: number,
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
  description: string,
  filePath: string,
  isTdsDeduct: boolean,
  isgst: boolean,
  gstTypeID: number,
  cgstVal: number,
  sgstVal: number,
  igstVal: number,
  gstAmount: number,
  tdsPer: number,
  createBy: number,
  ipAddress: string,
  tdsAmount: number,
  sgstPer: number,
  cgstPer: number,
  igstPer: number,
  afterTDSAmt: number,
  afterGSTAmount: number,
  finalAmount: number
) {
  return axios.post(AddProjectFundPayToVendorMultiple, {
    projectList,
    vendorID,
    // projectID,
    paymentDate,
    // amount,
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
    description,
    filePath,
    isTdsDeduct,
    isgst,
    gstTypeID,
    cgstVal,
    sgstVal,
    igstVal,
    gstAmount,
    tdsPer,
    createBy,
    ipAddress,
    tdsAmount,
    sgstPer,
    cgstPer,
    igstPer,
    afterTDSAmt,
    afterGSTAmount,
    finalAmount,
  })
}

export function GetPayFundList() {
  return axios.get(GET_PAY_FUND_LIST)
}

export function DeletePayFundDetails(projectPaymentID: number) {
  return axios.post(DELETE_PAY_FUND_DETAILS, {projectPaymentID})
}
export function UpdateProjectFundPayDetails(
  projectPaymentID: number,
  vendorID: number,
  projectID: number,
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
  vendorInvoiceNo: string,
  description: string,
  filePath: string,
  isTdsDeduct: boolean,
  isgst: boolean,
  gstTypeID: number,
  cgstVal: number,
  sgstVal: number,
  igstVal: number,
  gstAmount: number,
  tdsPer: number,
  sgstPer: number,
  cgstPer: number,
  igstPer: number,
  updateBy: number,
  ipAddress: string,
  tdsAmount: number,
  afterTDSAmt: number,
  afterGSTAmount: number,
  finalAmount: number
) {
  return axios.post(UPDATE_PAY_FUND_DETAILS, {
    projectPaymentID,
    vendorID,
    projectID,
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
    vendorInvoiceNo,
    description,
    filePath,
    isTdsDeduct,
    isgst,
    gstTypeID,
    cgstVal,
    sgstVal,
    igstVal,
    gstAmount,
    tdsPer,
    sgstPer,
    cgstPer,
    igstPer,
    updateBy,
    ipAddress,
    tdsAmount,
    afterTDSAmt,
    afterGSTAmount,
    finalAmount,
  })
}
export function GetPayFundByProjectPaymentID(projectPaymentID: number) {
  return axios.post(GET_PAY_FUND_BY_PROJECT_PAYMENT_ID, {projectPaymentID})
}

export function GetPayFundListFilterAPI(
  vendorID: number,
  searchText: string,
  startDate: string,
  endDate: string
) {
  return axios.post(Get_PayFund_List_Filter, {vendorID, searchText, startDate, endDate})
}

export function GetExcelPayFundListFilterAPI(
  vendorID: number,
  searchText: string,
  startDate: string,
  endDate: string
) {
  return axios.post(Excel_GetPay_FundList_Filter, {vendorID, searchText, startDate, endDate})
}

export function GetProjectListByVendorID_For_PayPaymentAPI(vendorID: number) {
  return axios.post(GetProjectListByVendorID_For_PayPayment, {vendorID})
}
