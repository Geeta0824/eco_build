import axios from 'axios'
import {number} from 'yup'
const BASE_API_URL = process.env.REACT_APP_API_URL
//=====================================================
export const Get_Other_Fund_Recive_List = `${BASE_API_URL}/OtherFund/GetFundReceiveList`
export const Add_Other_Fund_Recive = `${BASE_API_URL}/OtherFund/AddOtherFundReceive`
export const Get_Other_FundReceive_ByID = `${BASE_API_URL}/OtherFund/GetOtherFundReceiveByID`
export const Update_Other_Fund_Recive = `${BASE_API_URL}/OtherFund/UpdateOtherFundReceive`
export const DELETE_Other_Fund_Recive = `${BASE_API_URL}/OtherFund/DeleteFundReceive`
export const Get_FranchiseList_By_Filter = `${BASE_API_URL}/Employee/GetFranchiseListByFilter`

export function GetOtherFundReceiveListAPI() {
  return axios.get(Get_Other_Fund_Recive_List)
}

export function AddOtherFundReciveAPI(
  vendorID: number,
  franchiseID: number,
  paymentDate: string,
  amount: number,
  paymentFromID: number,
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
  createBy: number,
  ipAddress: string,
  isTCS: boolean,
  tcsPer: number,
  tcsAmount: number
) {
  return axios.post(Add_Other_Fund_Recive, {
    vendorID,
    franchiseID,
    paymentDate,
    amount,
    paymentFromID,
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
    createBy,
    ipAddress,
    isTCS,
    tcsPer,
    tcsAmount,
  })
}

export function GetOtherFundReceiveByOtherPaymentIDAPI(otherPaymentID: number) {
  return axios.post(Get_Other_FundReceive_ByID, {
    otherPaymentID,
  })
}

export function UpdateOtherFundReciveAPI(
  otherPaymentID: number,
  vendorID: number,
  franchiseID: number,
  paymentDate: string,
  amount: number,
  paymentFromID: number,
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
  updateBy: number,
  ipAddress: string,
  isTCS: boolean,
  tcsPer: number,
  tcsAmount: number
) {
  return axios.post(Update_Other_Fund_Recive, {
    otherPaymentID,
    vendorID,
    franchiseID,
    paymentDate,
    amount,
    paymentFromID,
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
    updateBy,
    ipAddress,
    isTCS,
    tcsPer,
    tcsAmount,
  })
}

export function DeleteOtherFundReceive(otherPaymentID: number) {
  return axios.post(DELETE_Other_Fund_Recive, {
    otherPaymentID,
  })
}

export function GetFranchiseListByFilterAPI(searchText: string) {
  return axios.post(Get_FranchiseList_By_Filter, {searchText})
}
