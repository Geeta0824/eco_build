import axios from 'axios'
import {
  IDebitNoteCheckedModel,
  IDebitNoteEditModel,
} from '../../../models/Accounts-page/debit-note-page/IDebitNoteModel'
const BASE_API_URL = process.env.REACT_APP_API_URL
// =================Emp Education URL=====================
export const GetPurchaseMastersDataByPurchaseMastersID = `${BASE_API_URL}/PurchaseMasters/GetPurchaseMastersDataByPurchaseMastersID`
export const AddDebitNotesMst = `${BASE_API_URL}/DebitNote/AddDebitNotesMst`
export const UpdateDebitNotesMst = `${BASE_API_URL}/DebitNote/UpdateDebitNotesMst`
export const GetDebitNoteDataByDebitNoteID = `${BASE_API_URL}/DebitNote/GetDebitNoteDataByDebitNoteID`
export const Get_Debit_Note_List = `${BASE_API_URL}/DebitNote/GetDebitNoteList`

export function GetPurchaseMastersDataByPurchaseMastersIDaPI(purchaseID: number) {
  return axios.post(GetPurchaseMastersDataByPurchaseMastersID, {purchaseID})
}
export function GetDebitNoteListIPI() {
  return axios.get(Get_Debit_Note_List)
}

export function GetDebitNoteDataByDebitNoteIDApi(debitNoteID: number) {
  return axios.post(GetDebitNoteDataByDebitNoteID, {debitNoteID})
}

export function AddDebitNotesMstApi(
  vendorName: string,
  itemDescr: string,
  debitNoteDate: string,
  documentPath: string,
  totalAmount: string,
  purchaseID: number,
  createBy: number,
  ipAddress: string,
  vendorID: number,
  vendorTypdID: number,
  itemList: IDebitNoteCheckedModel[]
) {
  return axios.post(AddDebitNotesMst, {
    vendorName,
    itemDescr,
    debitNoteDate,
    documentPath,
    totalAmount,
    purchaseID,
    createBy,
    ipAddress,
    vendorID,
    vendorTypdID,
    itemList,
  })
}

export function UpdateDebitNotesMstApi(
  debitNoteID: number,
  vendorName: string,
  itemDescr: string,
  purchaseDate: string,
  documentPath: string,
  totalAmount: string,
  purchaseID: number,
  updateBy: number,
  ipAddress: string,
  vendorID: number,
  vendorTypdID: number,
  itemList: IDebitNoteEditModel[]
) {
  return axios.post(UpdateDebitNotesMst, {
    debitNoteID,
    vendorName,
    itemDescr,
    purchaseDate,
    documentPath,
    totalAmount,
    purchaseID,
    updateBy,
    ipAddress,
    vendorID,
    vendorTypdID,
    itemList,
  })
}
