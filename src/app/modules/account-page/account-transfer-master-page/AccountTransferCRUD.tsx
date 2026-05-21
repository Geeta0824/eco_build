import axios from 'axios'

const BASE_API_URL = process.env.REACT_APP_API_URL
// =================Ac=============count Transfer==============================================
export const Add_Account_Transfer_Details = `${BASE_API_URL}/AccountTransfer/Add_AccountTransfer`
export const UPDATE_Account_Transfer_Details = `${BASE_API_URL}/AccountTransfer/Update_AccountTransfer`
export const DELETE_Account_Transfer_Details = `${BASE_API_URL}/AccountTransfer/Delete_AccountTransfer`
export const GET_Account_Transfer_LIST = `${BASE_API_URL}/AccountTransfer/Get_AccountTransferList`
export const GET_Account_Transfer_BY_ID = `${BASE_API_URL}/AccountTransfer/Get_AccountTransfer_ByID`
export const GET_Account_Transfer_LIST_Filter = `${BASE_API_URL}/AccountTransfer/Get_AccountTransferList_Filter`
export function getAccountTransferListFilter(
  fromAccountID: number,
  toAccountID: number,
  searchText: string,
  startDate: string,
  endDate: string
) {
  return axios.post(GET_Account_Transfer_LIST_Filter, {
    fromAccountID,
    toAccountID,
    searchText,
    startDate,
    endDate,
  })
}

export function AddAccountTransferDetails(
  transferDate: string,
  amount: number,
  fromAccountID: number,
  fromSubAccountID: number,
  toAccountID: number,
  toSubAccountID: number,
  transactionModeID: number,
  transactionID: string,
  chequeBankName: string,
  chequeBankBranch: string,
  chequeDate: string,
  chequeAmount: number,
  chequeNumber: string,
  description: string,
  filePath: string,
  createBy: number,
  ipAddress: string
) {
  return axios.post(Add_Account_Transfer_Details, {
    transferDate,
    amount,
    fromAccountID,
    fromSubAccountID,
    toAccountID,
    toSubAccountID,
    transactionModeID,
    transactionID,
    chequeBankName,
    chequeBankBranch,
    chequeDate,
    chequeAmount,
    chequeNumber,
    description,
    filePath,
    createBy,
    ipAddress,
  })
}
export function updateAccountTransferDetails(
  accountTransferID: number,
  transferDate: string,
  amount: number,
  fromAccountID: number,
  fromSubAccountID: number,
  toAccountID: number,
  toSubAccountID: number,
  transactionModeID: number,
  transactionID: string,
  chequeBankName: string,
  chequeBankBranch: string,
  chequeDate: string,
  chequeAmount: number,
  chequeNumber: string,
  description: string,
  filePath: string,
  updateBy: number,
  ipAddress: string
) {
  return axios.post(UPDATE_Account_Transfer_Details, {
    accountTransferID,
    transferDate,
    amount,
    fromAccountID,
    fromSubAccountID,
    toAccountID,
    toSubAccountID,
    transactionModeID,
    transactionID,
    chequeBankName,
    chequeBankBranch,
    chequeDate,
    chequeAmount,
    chequeNumber,
    description,
    filePath,
    updateBy,
    ipAddress,
  })
}

export function getAccountTransferList() {
  return axios.get(GET_Account_Transfer_LIST, {})
}
export function DeleteAccountTransfer(accountTransferID: number, deleteBy: number) {
  return axios.post(DELETE_Account_Transfer_Details, {
    accountTransferID,
    deleteBy,
  })
}
export function GetAccountTranByID(accountTransferID: number) {
  return axios.post(GET_Account_Transfer_BY_ID, {
    accountTransferID,
  })
}
