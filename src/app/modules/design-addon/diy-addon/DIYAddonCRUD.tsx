import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL
// ================= DegignAddon URL=====================
export const GetDegignAddon_DIY_QuotationList = `${BASE_API_URL}/DesignAddon/GetDegignAddon_DIY_QuotationList` //upgrade Delete
export const GetDegignAddon_DIY_QuotationList_ForAdd = `${BASE_API_URL}/DesignAddon/GetDegignAddon_DIY_QuotationList_ForAdd` //upgrade Delete
export const GetDesignAddonCartListByQuotationID = `${BASE_API_URL}/DesignAddon/GetDesignAddonCartListByQuotationID` //upgrade Delete
export const DesignAddonDeleteQuotationDetail = `${BASE_API_URL}/DesignAddon/DesignAddonDeleteQuotationDetail` //upgrade Delete
export const SaveDesignAddonQuotaionDetail = `${BASE_API_URL}/DesignAddon/SaveDesignAddonQuotaionDetail` //upgrade Delete
export const AddAgainDesignAddonDeletedProductDetail = `${BASE_API_URL}/DesignAddon/AddAgainDesignAddonDeletedProductDetail` //upgrade Delete
export const Add_DIY_Addon_UpgradeItems_Details = `${BASE_API_URL}/DesignAddon/Add_DIY_DesignAddon_UpgradeItems_Details`
export const Delete_DIY_DesignAddon_UpGradeItemMapData = `${BASE_API_URL}/DesignAddon/Delete_DIY_DesignAddon_UpGradeItemMapData`
export const Again_Add_Deleted_DIY_DesignAddon_UpgradeItems_Details = `${BASE_API_URL}/DesignAddon/Again_Add_Deleted_DIY_DesignAddon_UpgradeItems_Details`
export const DesignAddon_Booked_DIYQuotation = `${BASE_API_URL}/DesignAddon/DesignAddon_Booked_DIYQuotation`

export function GetGetDegignAddon_DIY_QuotationListAPI(
  employeeID: number,
  customerID: number,
  searchText: string
) {
  return axios.post(GetDegignAddon_DIY_QuotationList, {employeeID, customerID, searchText})
}

export function GetGetDegignAddon_DIY_QuotationList_ForAddAPI() {
  return axios.get(GetDegignAddon_DIY_QuotationList_ForAdd)
}

export function GetDesignAddonCartListByQuotationIDAPI(quotationID: number) {
  return axios.post(GetDesignAddonCartListByQuotationID, {quotationID})
}

export function DesignAddonDeleteQuotationDetailAPI(quotationDetailID: number) {
  return axios.post(DesignAddonDeleteQuotationDetail, {quotationDetailID})
}

export function AddAgainDesignAddonDeletedProductAPI(quotationDetailID: number) {
  return axios.post(AddAgainDesignAddonDeletedProductDetail, {quotationDetailID})
}

export function SaveDesignAddonQuotaionDetailAPI(
  designerID: number,
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
  return axios.post(SaveDesignAddonQuotaionDetail, {
    designerID,
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

export function GetAdd_DIY_Addon_UpgradeItems_DetailsAPI(
  qutationID: number,
  upGradeItemID: number
) {
  return axios.post(Add_DIY_Addon_UpgradeItems_Details, {qutationID, upGradeItemID})
}

export function Delete_DIY_DesignAddon_UpGradeItemMapDataAPI(dIYUpgrageItemMapID: number) {
  return axios.post(Delete_DIY_DesignAddon_UpGradeItemMapData, {dIYUpgrageItemMapID})
}

export function Again_Add_Deleted_DIY_DesignAddon_UpgradeItems_DetailsAPI(
  dIYUpgrageItemMapID: number
) {
  return axios.post(Again_Add_Deleted_DIY_DesignAddon_UpgradeItems_Details, {dIYUpgrageItemMapID})
}
export function BookedDesignAddon_Booked_DIYQuotationApi(
  quotationID: number,
  bookBy: number,
  projectID: number
) {
  return axios.post(DesignAddon_Booked_DIYQuotation, {
    quotationID,
    bookBy,
    projectID,
  })
}
