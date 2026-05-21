import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL

// =================Customization Quotation URL=====================
export const GET_Customization_QUOTATION = `${BASE_API_URL}/CustomQuotation/GetCustomQuotationList` // 1st
export const CREATE_Customization_QUOTATION = `${BASE_API_URL}/CustomQuotation/MakeCustomerQuotation` // 2nd
export const GET_CART_LIST_FROM_PACKAGE_QUOTATION = `${BASE_API_URL}/CustomQuotation/MoveDetailFromPackageToCart` //3rd
export const SAVE_QUOTATION_IN_CART = `${BASE_API_URL}/CustomQuotation/SaveCustomQuotaionDetail`
export const GET_QUOTATION_LIST_IN_CART = `${BASE_API_URL}/CustomQuotation/GetCustomCartListByQuotationID`
export const GET_QUOTATION_DETAILS_BY_ID = `${BASE_API_URL}/CustomQuotation/GetCustomCartListByQuotationDetailID`
export const Update_QUOTATION_IN_CART = `${BASE_API_URL}/CustomQuotation/UpdateCustomQuotaionDetail`
export const DELETE_QUOTATION_LIST_IN_CART = `${BASE_API_URL}/CustomQuotation/DeleteCustomQuotationDetail`
export const Customization_QUOTATION_DISCOUNT = `${BASE_API_URL}/CustomQuotation/CustomGenerateReqForExtraDisc`
export const GET_Product_List_Cart_NEW = `${BASE_API_URL}/Quotation/GetProductListForCartNew`
export const CHECK_OUT_Customization_QUOTATION = `${BASE_API_URL}/CustomQuotation/CheckoutCustomQute`
export const Get_Product_List_For_Product_Change = `${BASE_API_URL}/CustomQuotation/GetProductListForChangeProduct`
export const Change_Product_From_Custom_Cart = `${BASE_API_URL}/CustomQuotation/ChangeProductFromCustomCart`
export const Booked_Custom_Quotation = `${BASE_API_URL}/CustomQuotation/Booked_CustomQuotation`
export const Multiple_Dropdown_List_For_Customization_Quotation = `${BASE_API_URL}/MultipleDropdownList/GetCustomization_Que_DropdownList_ForDropdown`
// =========================
export function getMultipleDropdownListApi() {
  return axios.get(Multiple_Dropdown_List_For_Customization_Quotation)
}

export function GetCustomizationQuotationListApi(
  employeeID: number,
  customerID: number,
  searchText: string
) {
  return axios.post(GET_Customization_QUOTATION, {employeeID, customerID, searchText})
}

export function GetCartListFromPackageIDApi(
  qutationID: number,
  packageID: number,
  spTypeID: number
) {
  return axios.post(GET_CART_LIST_FROM_PACKAGE_QUOTATION, {qutationID, packageID, spTypeID})
}

export function createCustomizationQuotationApi(
  customerID: number,
  carpetAreaID: number,
  bhkID: number,
  projectTypeID: number,
  createBy: number,
  ipAddress: string
) {
  return axios.post(CREATE_Customization_QUOTATION, {
    customerID,
    carpetAreaID,
    bhkID,
    projectTypeID,
    createBy,
    ipAddress,
  })
}
// ----------
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

export function GetCartListByQuotationIDApi(quotationID: number) {
  return axios.post(GET_QUOTATION_LIST_IN_CART, {quotationID})
}

export function getUpdateQuotaionDetailObj(quotationDetailID: number) {
  return axios.post(GET_QUOTATION_DETAILS_BY_ID, {quotationDetailID})
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

export function deleteQuotationDetailIDApi(quotationDetailID: number) {
  return axios.post(DELETE_QUOTATION_LIST_IN_CART, {quotationDetailID})
}

export function customizationQuotaionDiscountApi(
  employeeID: number,
  customerID: number,
  searchText: string,
  quotationID: number,
  discountTypeID: number,
  reqDisc: string,
  requestBy: number
) {
  return axios.post(Customization_QUOTATION_DISCOUNT, {
    employeeID,
    customerID,
    searchText,
    quotationID,
    discountTypeID,
    reqDisc,
    requestBy,
  })
}

export function GetProductListForCartNewApi(
  areaID: number,
  categoryID: number,
  searchText: string
) {
  return axios.post(GET_Product_List_Cart_NEW, {areaID, categoryID, searchText})
}

export function checkoutCustomizationQuotationApi(quotationID: number, skipID: number) {
  return axios.post(CHECK_OUT_Customization_QUOTATION, {quotationID, skipID})
}

export function GetProductListForChangeProductApi(quotationDetailID: number) {
  return axios.post(Get_Product_List_For_Product_Change, {quotationDetailID})
}

export function ChangeProductFromCustomCartApi(quotationDetailID: number, newProductID: number) {
  return axios.post(Change_Product_From_Custom_Cart, {quotationDetailID, newProductID})
}

export function BookedCustomQuotationApi(quotationID: number, bookBy: number) {
  return axios.post(Booked_Custom_Quotation, {quotationID, bookBy})
}
