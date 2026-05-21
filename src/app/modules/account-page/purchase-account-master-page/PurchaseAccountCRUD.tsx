import axios from 'axios'
import {IPurchaseAccCheckModel} from '../../../models/Accounts-page/purchase-account-page/IPurchaseAccountModel'
const BASE_API_URL = process.env.REACT_APP_API_URL
// =================Change Password=====================
export const ADD_PURCHASE_ACCOUNT_DETAILS = `${BASE_API_URL}/PurchaseMasters/AddPurchaseMastersDetails`
export const GET_PURCHASE_ACCOUNT_LIST = `${BASE_API_URL}/PurchaseMasters/GetPurchaseMastersWebList`
export const DELETE_PURCHASE_ACCOUNT_DETAILS = `${BASE_API_URL}/PurchaseMasters/PostDeletePurchaseMasters`
export const UPDATE_PURCHASE_ACCOUNT_DETAILS = `${BASE_API_URL}/PurchaseMasters/UpdatePurchaseMasterDetails`
export const GET_PURCHASE_ACCOUNT_BY_ID = `${BASE_API_URL}/PurchaseMasters/GetPurchaseMastersDataByPurchaseMastersID`
export const GET_PURCHASE_ACCOUNT_BY_ID_FILTER = `${BASE_API_URL}/PurchaseMasters/GetPurchaseMastersWebList_Filter`
export const GET_PURCHASE_ACCOUNT_BY_ID_EXCEL = `${BASE_API_URL}/PurchaseMasters/ExportExcel_GetPurchaseReport`

export function AddPurchaseAccountDetails(
  vendorName: string,
  itemDescr: string,
  purchaseDate: string,
  documentPath: string,
  totalAmount: number,
  createBy: number,
  ipAddress: string,
  vendorID: number,
  vendorTypdID: number,
  itemList: IPurchaseAccCheckModel[]
) {
  return axios.post(ADD_PURCHASE_ACCOUNT_DETAILS, {
    vendorName,
    itemDescr,
    purchaseDate,
    documentPath,
    totalAmount,
    createBy,
    ipAddress,
    vendorID,
    vendorTypdID,
    itemList,
  })
}

export function getPurchaseAccountList() {
  return axios.get(GET_PURCHASE_ACCOUNT_LIST, {})
}

export function deletePurchaseAccountDetails(purchaseID: number) {
  return axios.post(DELETE_PURCHASE_ACCOUNT_DETAILS, {purchaseID})
}

export function updatePurchaseAccountDetails(
  purchaseID: number,
  vendorName: string,
  itemDescr: string,
  purchaseDate: string,
  documentPath: string,
  totalAmount: number,
  updateBy: number,
  ipAddress: string,
  vendorID: number,
  vendorTypdID: number,
  itemList: IPurchaseAccCheckModel[]
) {
  return axios.post(UPDATE_PURCHASE_ACCOUNT_DETAILS, {
    purchaseID,
    vendorName,
    itemDescr,
    purchaseDate,
    documentPath,
    totalAmount,
    updateBy,
    ipAddress,
    vendorID,
    vendorTypdID,
    itemList,
  })
}

export function getPurchaseAccountDataByPurchaseID(purchaseID: number) {
  return axios.post(GET_PURCHASE_ACCOUNT_BY_ID, {purchaseID})
}

export function getPurchaseAccountListFilter(
  vendorID: number,
  startDate: string,
  endDate: string,
  searchText: string
) {
  return axios.post(GET_PURCHASE_ACCOUNT_BY_ID_FILTER, {
    vendorID,
    startDate,
    endDate,
    searchText,
  })
}

export function getPurchaseAccountList_Excel(
  vendorID: number,
  startDate: string,
  endDate: string,
  searchText: string
) {
  return axios.post(GET_PURCHASE_ACCOUNT_BY_ID_EXCEL, {
    vendorID,
    startDate,
    endDate,
    searchText,
  })
}
