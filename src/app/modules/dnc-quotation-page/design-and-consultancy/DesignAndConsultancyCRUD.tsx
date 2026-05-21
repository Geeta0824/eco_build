import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL
// =================Emp Education URL=====================
export const Get_DNC_QuotationList = `${BASE_API_URL}/DNC/GetDNCQuotationList`
export const Make_DNC_Quotation = `${BASE_API_URL}/DNC/MakeDNCQuotation`
export const Update_DNC_Quotation_Isactive = `${BASE_API_URL}/DNC/UpdateDNCQuotationIsactive`
export const DNC_QUOTATION_DISCOUNT = `${BASE_API_URL}/DNC/GenerateReqForExtraDisc`
export const Booked_DNC_Quotation = `${BASE_API_URL}/DNC/Booked_DNCQuotation`

// export const GET_Product_List_Cart = `${BASE_API_URL}/Quotation/GetProductListForCart`
// export const GET_Product_List_Cart_NEW = `${BASE_API_URL}/Quotation/GetProductListForCartNew`
// export const SAVE_QUOTATION_IN_CART = `${BASE_API_URL}/Quotation/SaveQuotaionDetail`
// export const Update_QUOTATION_IN_CART = `${BASE_API_URL}/Quotation/UpdateQuotaionDetail`
// export const GET_QUOTATION_LIST_IN_CART = `${BASE_API_URL}/Quotation/GetCartListByQuotationID`
// export const GET_QUOTATION_DETAILS_BY_ID = `${BASE_API_URL}/Quotation/GetCartListByQuotationDetailID`
// export const DELETE_QUOTATION_LIST_IN_CART = `${BASE_API_URL}/Quotation/DeleteQuotationDetail`
// export const CHECK_OUT_DIY_QUOTATION = `${BASE_API_URL}/Quotation/CheckoutDIYQute`

export function GetDNCQuotationListApi(employeeID: number, customerID: number, searchText: string) {
  return axios.post(Get_DNC_QuotationList, {employeeID, customerID, searchText})
}

export function MakeDNCQuotationApi(
  customerID: number,
  carpetArea: number,
  bhkID: number,
  createBy: number,
  ipAddress: string,
  isBeforeDiscount: boolean
) {
  return axios.post(Make_DNC_Quotation, {
    customerID,
    carpetArea,
    bhkID,
    createBy,
    ipAddress,
    isBeforeDiscount,
  })
}

export function DNCQuotationIsactiveApi(quotationID: number, isBeforeDiscount: boolean) {
  return axios.post(Update_DNC_Quotation_Isactive, {quotationID, isBeforeDiscount})
}

export function dncQuotaionDiscountApi(
  employeeID: number,
  customerID: number,
  searchText: string,
  quotationID: number,
  discountTypeID: number,
  reqDisc: string,
  requestBy: number
) {
  return axios.post(DNC_QUOTATION_DISCOUNT, {
    employeeID,
    customerID,
    searchText,
    quotationID,
    discountTypeID,
    reqDisc,
    requestBy,
  })
}

export function BookedDNCQuotationApi(
  quotationID: number,
  bookBy: number,
  projectName: string,
  bookingDate: string
) {
  return axios.post(Booked_DNC_Quotation, {quotationID, bookBy, projectName, bookingDate})
}

// export function GetProductListForCartApi(categoryID: number, searchText: string) {
//   return axios.post(GET_Product_List_Cart, {categoryID, searchText})
// }

// export function GetProductListForCartNewApi(
//   areaID: number,
//   categoryID: number,
//   searchText: string
// ) {
//   return axios.post(GET_Product_List_Cart_NEW, {areaID, categoryID, searchText})
// }

// export function GetCartListByQuotationIDApi(quotationID: number) {
//   return axios.post(GET_QUOTATION_LIST_IN_CART, {quotationID})
// }

// export function getUpdateQuotaionDetailObj(quotationDetailID: number) {
//   return axios.post(GET_QUOTATION_DETAILS_BY_ID, {quotationDetailID})
// }

// export function deleteQuotationDetailIDApi(quotationDetailID: number) {
//   return axios.post(DELETE_QUOTATION_LIST_IN_CART, {quotationDetailID})
// }

// export function checkoutDIYQuotationApi(quotationID: number, skipID: number) {
//   return axios.post(CHECK_OUT_DIY_QUOTATION, {quotationID, skipID})
// }

// export function saveQuotationDetailinCartApi(
//   qutationID: number,
//   categoryID: number,
//   productID: number,
//   planAreaID: number,
//   unitID: number,
//   length: number,
//   depth: number,
//   height: number,
//   noOfUnit: number
// ) {
//   return axios.post(SAVE_QUOTATION_IN_CART, {
//     qutationID,
//     categoryID,
//     productID,
//     planAreaID,
//     unitID,
//     length,
//     depth,
//     height,
//     noOfUnit,
//   })
// }

// export function UpdateQuotationDetailinCartApi(
//   quotationDetailID: number | undefined,
//   qutationID: number,
//   categoryID: number,
//   productID: number,
//   planAreaID: number,
//   unitID: number,
//   length: number,
//   depth: number,
//   height: number,
//   noOfUnit: number
// ) {
//   return axios.post(Update_QUOTATION_IN_CART, {
//     quotationDetailID,
//     qutationID,
//     categoryID,
//     productID,
//     planAreaID,
//     unitID,
//     length,
//     depth,
//     height,
//     noOfUnit,
//   })
// }
