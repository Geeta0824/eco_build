import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL
// =================Emp Education URL=====================
export const GET_DIY_QUOTATION = `${BASE_API_URL}/Quotation/GetDIYQuotationList`
export const GET_Product_List_Cart = `${BASE_API_URL}/Quotation/GetProductListForCart`
export const GET_Product_List_Cart_NEW = `${BASE_API_URL}/Quotation/GetProductListForCartNew`
export const CREATE_DIY_QUOTATION = `${BASE_API_URL}/Quotation/MakeDIYQuotation`
export const SAVE_QUOTATION_IN_CART = `${BASE_API_URL}/Quotation/SaveQuotaionDetail`
export const Update_QUOTATION_IN_CART = `${BASE_API_URL}/Quotation/UpdateQuotaionDetail`
export const GET_QUOTATION_LIST_IN_CART = `${BASE_API_URL}/Quotation/GetCartListByQuotationID`
export const GET_QUOTATION_DETAILS_BY_ID = `${BASE_API_URL}/Quotation/GetCartListByQuotationDetailID`
export const DELETE_QUOTATION_LIST_IN_CART = `${BASE_API_URL}/Quotation/DeleteQuotationDetail`
export const DIY_QUOTATION_DISCOUNT = `${BASE_API_URL}/Quotation/GenerateReqForExtraDisc`
export const CHECK_OUT_DIY_QUOTATION = `${BASE_API_URL}/Quotation/CheckoutDIYQute`
export const Booked_DIY_Quotation = `${BASE_API_URL}/Quotation/Booked_DIYQuotation`

export function GetDiyQuotationListApi(employeeID: number, customerID: number, searchText: string) {
  return axios.post(GET_DIY_QUOTATION, {employeeID, customerID, searchText})
}

export function GetProductListForCartApi(categoryID: number, searchText: string) {
  return axios.post(GET_Product_List_Cart, {categoryID, searchText})
}

export function GetProductListForCartNewApi(
  areaID: number,
  categoryID: number,
  searchText: string
) {
  return axios.post(GET_Product_List_Cart_NEW, {areaID, categoryID, searchText})
}

export function GetCartListByQuotationIDApi(quotationID: number) {
  return axios.post(GET_QUOTATION_LIST_IN_CART, {quotationID})
}

export function getUpdateQuotaionDetailObj(quotationDetailID: number) {
  return axios.post(GET_QUOTATION_DETAILS_BY_ID, {quotationDetailID})
}

export function deleteQuotationDetailIDApi(quotationDetailID: number) {
  return axios.post(DELETE_QUOTATION_LIST_IN_CART, {quotationDetailID})
}

export function checkoutDIYQuotationApi(quotationID: number, skipID: number) {
  return axios.post(CHECK_OUT_DIY_QUOTATION, {quotationID, skipID})
}

export function diyQuotaionDiscountApi(
  employeeID: number,
  customerID: number,
  searchText: string,
  quotationID: number,
  discountTypeID: number,
  reqDisc: string,
  requestBy: number
) {
  return axios.post(DIY_QUOTATION_DISCOUNT, {
    employeeID,
    customerID,
    searchText,
    quotationID,
    discountTypeID,
    reqDisc,
    requestBy,
  })
}

export function createDIYQuotationApi(
  customerID: number,
  carpetAreaID: number,
  bhkID: number,
  // projectTypeID: number,
  createBy: number,
  ipAddress: string
) {
  let projectTypeID = 1
  return axios.post(CREATE_DIY_QUOTATION, {
    customerID,
    carpetAreaID,
    bhkID,
    projectTypeID,
    createBy,
    ipAddress,
  })
}

export function saveQuotationDetailinCartApi(
  qutationID: number,
  categoryID: number,
  productID: number,
  planAreaID: number,
  unitID: number,
  length: number,
  depth: number,
  height: number,
  noOfUnit: number
) {
  return axios.post(SAVE_QUOTATION_IN_CART, {
    qutationID,
    categoryID,
    productID,
    planAreaID,
    unitID,
    length,
    depth,
    height,
    noOfUnit,
  })
}

export function UpdateQuotationDetailinCartApi(
  quotationDetailID: number | undefined,
  qutationID: number,
  categoryID: number,
  productID: number,
  planAreaID: number,
  unitID: number,
  length: number,
  depth: number,
  height: number,
  noOfUnit: number
) {
  return axios.post(Update_QUOTATION_IN_CART, {
    quotationDetailID,
    qutationID,
    categoryID,
    productID,
    planAreaID,
    unitID,
    length,
    depth,
    height,
    noOfUnit,
  })
}

export function BookedDiyQuotationApi(quotationID: number, bookBy: number) {
  return axios.post(Booked_DIY_Quotation, {quotationID, bookBy})
}
