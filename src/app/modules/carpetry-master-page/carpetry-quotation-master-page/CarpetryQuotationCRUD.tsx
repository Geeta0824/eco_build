import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL

// =================Customization Quotation URL=====================
export const GET_TURNKEY_Customization_QUOTATION = `${BASE_API_URL}/TurnkeyCustomQuotation/GetTurnkeyQuotationList` // 1st
export const GET_TURNKEY_Customization_QUOTATION_pagination = `${BASE_API_URL}/TurnkeyCustomQuotation/GetTurnkeyQuotationList_pagination` // 1st
export const CREATE_TURNKEY_Customization_QUOTATION = `${BASE_API_URL}/TurnkeyCustomQuotation/MakeCustomerQuotation` // 2nd
export const GET_CART_LIST_FROM_PACKAGE_QUOTATION = `${BASE_API_URL}/TurnkeyCustomQuotation/MoveDetailFromPackageToCart` //3rd
export const SAVE_TURNKEY_QUOTATION_IN_CART = `${BASE_API_URL}/TurnkeyCustomQuotation/SaveTurnkeyQuotaionDetail`
export const GET_QUOTATION_LIST_IN_CART = `${BASE_API_URL}/TurnkeyCustomQuotation/GetTurnkeyCartListByQuotationID`
export const GET_QUOTATION_DETAILS_BY_ID = `${BASE_API_URL}/TurnkeyCustomQuotation/GetTurnkeyCartListByQuotationDetailID`
export const Update_QUOTATION_IN_CART = `${BASE_API_URL}/TurnkeyCustomQuotation/UpdateTurnkeyQuotaionDetail`
export const DELETE_QUOTATION_LIST_IN_CART = `${BASE_API_URL}/TurnkeyCustomQuotation/DeleteTurnkeyQuotationDetail`
export const Customization_QUOTATION_DISCOUNT = `${BASE_API_URL}/TurnkeyCustomQuotation/TurnkeyGenerateReqForExtraDisc`
export const GET_Product_List_Cart_NEW = `${BASE_API_URL}/TurnkeyCustomQuotation/GetTurnkeyProductListForCartNew`
export const CHECK_OUT_Customization_QUOTATION = `${BASE_API_URL}/TurnkeyCustomQuotation/CheckoutTurnkeyQute`
export const Get_Product_List_For_Product_Change = `${BASE_API_URL}/CustomQuotation/GetProductListForChangeProduct`
export const Change_Product_From_Custom_Cart = `${BASE_API_URL}/TurnkeyCustomQuotation/ChangeProductFromTurnkeyCart`
export const DELETE_CARPENTRY_QUEA_AREA_BY_ID = `${BASE_API_URL}/TurnkeyCustomQuotation/DeleteCarpenteryQuotationAreaItem`
export const DELETE_CARPENTRY_QUEA_PRODUCT_BY_ID = `${BASE_API_URL}/TurnkeyCustomQuotation/DeleteCarpenteryQuotationProductItem`
export const Booked_Turnkey_Quotation = `${BASE_API_URL}/TurnkeyCustomQuotation/Booked_TurnkeyQuotation`
export const SaveAddon_Item_Turnkey_Quotation = `${BASE_API_URL}/TurnkeyCustomQuotation/SaveTurnkeyQuotaionDetail_WithAddonItem`
export const Get_Product_AsAddonList_ForCarpetry = `${BASE_API_URL}/Quotation/GetProductAsAddonListForCarpetry`
export const Add_Offer_TurnkeyCustom_Quotation = `${BASE_API_URL}/TurnkeyCustomQuotation/Add_TurnkeyQuotation_Offer_Details`
export const Delete_Offer_TurnkeyCustom_Quotation = `${BASE_API_URL}/TurnkeyCustomQuotation/DeleteCarpentryOfferByID`
export const Add_Again_Carpentery_Quotation_ProductItem = `${BASE_API_URL}/TurnkeyCustomQuotation/AddAgainCarpenteryQuotationProductItem`
export const Update_Turnkey_Quotation_Isactiv = `${BASE_API_URL}/TurnkeyCustomQuotation/UpdateTurnkeyQuotationIsactive`
export const Merge_Turnkey_With_Modular = `${BASE_API_URL}/TurnkeyCustomQuotation/Merge_Turnkey_With_Modular`
export const Get_Multi_Drop_down_For_Ready_Made_Quo = `${BASE_API_URL}/MultipleDropdownList/GetReadyMade_Quotation_DropdownList_ForDropdown`

export function getMultiDropdownReadyMadeQuoApi() {
  return axios.get(Get_Multi_Drop_down_For_Ready_Made_Quo)
}

export function GetTurnkeyQuotationListApi(
  projectTypeID: number,
  employeeID: number,
  customerID: number,
  searchText: string
) {
  return axios.post(GET_TURNKEY_Customization_QUOTATION, {
    projectTypeID,
    employeeID,
    customerID,
    searchText,
  })
}

export function GetTurnkeyQuotationListApi_pagination(
  projectTypeID: number,
  employeeID: number,
  customerID: number,
  searchText: string,
  pageNumber: number,
  pageSize: number
) {
  return axios.post(GET_TURNKEY_Customization_QUOTATION_pagination, {
    projectTypeID,
    employeeID,
    customerID,
    searchText,
    pageNumber,
    pageSize
  })
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
  ipAddress: string,
  isBeforeDiscount: boolean,
  cloneQuotationID: number
) {
  return axios.post(CREATE_TURNKEY_Customization_QUOTATION, {
    customerID,
    carpetAreaID,
    bhkID,
    projectTypeID,
    createBy,
    ipAddress,
    isBeforeDiscount,
    cloneQuotationID,
  })
}
// ----------
export function SaveTurnkeyQuotaionDetailinCartApi(
  qutationID: number,
  categoryID: number,
  productID: number,
  planAreaID: number,
  unitID: number,
  length: number,
  depth: number,
  height: number,
  noOfUnit: number,
  turnkeyQty: string
) {
  return axios.post(SAVE_TURNKEY_QUOTATION_IN_CART, {
    qutationID,
    categoryID,
    productID,
    planAreaID,
    unitID,
    length,
    depth,
    height,
    noOfUnit,
    turnkeyQty,
  })
}

export function GetCartListByQuotationIDApi(quotationID: number) {
  return axios.post(GET_QUOTATION_LIST_IN_CART, {quotationID})
}
export function TurnkeyQuotationIsactive(quotationID: number, isBeforeDiscount: boolean) {
  return axios.post(Update_Turnkey_Quotation_Isactiv, {quotationID, isBeforeDiscount})
}

export function getUpdateQuotaionDetailObj(quotationDetailID: number) {
  return axios.post(GET_QUOTATION_DETAILS_BY_ID, {quotationDetailID})
}

export function UpdateTurnkeyQuotationDetailinCartApi(
  quotationDetailID: number | undefined,
  qutationID: number,
  categoryID: number,
  productID: number,
  planAreaID: number,
  unitID: number,
  length: number,
  depth: number,
  height: number,
  noOfUnit: number,
  turnkeyQty: string
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
    turnkeyQty,
  })
}

export function DeleteTurnkeyQuotationDetailIDApi(quotationDetailID: number) {
  return axios.post(DELETE_QUOTATION_LIST_IN_CART, {quotationDetailID})
}

export function TurnkeycustomizationQuotaionDiscountApi(
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

export function CheckoutTurnkeyQuotationApi(quotationID: number, skipID: number) {
  return axios.post(CHECK_OUT_Customization_QUOTATION, {quotationID, skipID})
}

export function GetProductListForChangeProductApi(quotationDetailID: number) {
  return axios.post(Get_Product_List_For_Product_Change, {quotationDetailID})
}

export function ChangeProductFromCustomCartApi(quotationDetailID: number, newProductID: number) {
  return axios.post(Change_Product_From_Custom_Cart, {quotationDetailID, newProductID})
}

export function deleteCarpentryQueAreaByIDApi(quotationID: number, planAreaID: number) {
  return axios.post(DELETE_CARPENTRY_QUEA_AREA_BY_ID, {quotationID, planAreaID})
}

export function deleteCarpentryQueProductByIDApi(quotationDetailID: number) {
  return axios.post(DELETE_CARPENTRY_QUEA_PRODUCT_BY_ID, {quotationDetailID})
}

export function BookedTrunkeyQuotationApi(
  quotationID: number,
  bookBy: number,
  projectName: string,
  bookingDate: string
) {
  return axios.post(Booked_Turnkey_Quotation, {quotationID, bookBy, projectName, bookingDate})
}

export function SaveAddOnTurnkeyQuotaionDetailinCartApi(
  qutationID: number,
  categoryID: number,
  productID: number,
  planAreaID: number,
  unitID: number,
  length: number,
  depth: number,
  height: number,
  noOfUnit: number,
  turnkeyQty: string
) {
  return axios.post(SaveAddon_Item_Turnkey_Quotation, {
    qutationID,
    categoryID,
    productID,
    planAreaID,
    unitID,
    length,
    depth,
    height,
    noOfUnit,
    turnkeyQty,
  })
}

export function GetProductAsAddonListForCarpetryListApi(searchText: string) {
  return axios.post(Get_Product_AsAddonList_ForCarpetry, {searchText})
}

export function AddOfferTurnkeyCustomQuotationAPI(qutationID: number, offerID: number) {
  return axios.post(Add_Offer_TurnkeyCustom_Quotation, {qutationID, offerID})
}

export function deleteCarpentryQueOfferByIDApi(TurnekyQutationOfferID: number) {
  return axios.post(Delete_Offer_TurnkeyCustom_Quotation, {TurnekyQutationOfferID})
}

export function AddAgainCarpentryQueProductByIDApi(quotationDetailID: number) {
  return axios.post(Add_Again_Carpentery_Quotation_ProductItem, {quotationDetailID})
}
export function MergeTurnkeyWithModularApi(quotationID: number, modularQuotationID: number) {
  return axios.post(Merge_Turnkey_With_Modular, {quotationID, modularQuotationID})
}
