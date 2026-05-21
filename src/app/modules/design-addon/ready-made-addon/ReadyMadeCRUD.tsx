import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL
// ================= DegignAddon URL=====================
export const GetDegignAddon_ReadyMade_QuotationList = `${BASE_API_URL}/DesignAddon/GetDegignAddon_ReadyMade_QuotationList`
export const GetDegignAddon_RedyMade_QuotationList_ForAdd = `${BASE_API_URL}/DesignAddon/GetDegignAddon_RedyMade_QuotationList_ForAdd`
export const SaveTurnkeyQuotaionDetail_AddonItem_ReadyMade = `${BASE_API_URL}/DesignAddon/SaveTurnkeyQuotaionDetail_AddonItem_ReadyMade`
export const Delete_ReadyMade_Addon_CarpenteryQuotationProductItem = `${BASE_API_URL}/DesignAddon/Delete_ReadyMade_Addon_CarpenteryQuotationProductItem`
export const AddAgain_ReadyMade_AddonCarpenteryQuotationProductItem = `${BASE_API_URL}/DesignAddon/AddAgain_ReadyMade_AddonCarpenteryQuotationProductItem`

export function GetDegignAddon_ReadyMade_QuotationListAPI(
  projectTypeID: number,
  employeeID: number,
  customerID: number,
  searchText: string
) {
  return axios.post(GetDegignAddon_ReadyMade_QuotationList, {
    projectTypeID,
    employeeID,
    customerID,
    searchText,
  })
}

export function GetDegignAddon_ReadyMade_QuotationList_ForAddAPI() {
  return axios.get(GetDegignAddon_RedyMade_QuotationList_ForAdd)
}

export function SaveAddOnTurnkeyQuotaionDetailinCart_AddonItem_ReadyMadeAPI(
  qutationID: number,
  categoryID: number,
  productID: number,
  planAreaID: number,
  unitID: number,
  length: number,
  depth: number,
  height: number,
  noOfUnit: number,
  turnkeyQty: string,
  designerID: number
) {
  return axios.post(SaveTurnkeyQuotaionDetail_AddonItem_ReadyMade, {
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
    designerID,
  })
}

export function deleteReadyMade_AddonCarpentryQueProductByIDApi(quotationDetailID: number) {
  return axios.post(Delete_ReadyMade_Addon_CarpenteryQuotationProductItem, {quotationDetailID})
}

export function AddAgain_ReadyMade_Addon_CarpentryQueProductByIDApi(quotationDetailID: number) {
  return axios.post(AddAgain_ReadyMade_AddonCarpenteryQuotationProductItem, {quotationDetailID})
}
