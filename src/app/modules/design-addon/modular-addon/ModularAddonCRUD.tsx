import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL
// ================= DegignAddon Modular URL=====================
export const GetDegignAddon_Modular_QuotationList = `${BASE_API_URL}/DesignAddon/GetDegignAddon_Modular_QuotationList`
export const GetDegignAddon_Modular_QuotationList_ForAdd = `${BASE_API_URL}/DesignAddon/GetDegignAddon_Modular_QuotationList_ForAdd`
export const Delete_Modular_DesignAddon_Details = `${BASE_API_URL}/DesignAddon/Delete_Modular_DesignAddon_Details`
export const Again_Add_Deleted_Modular_DesignAddon_Details = `${BASE_API_URL}/DesignAddon/Again_Add_Deleted_Modular_DesignAddon_Details`
export const Save_DesignAddon_ModularQuotaionDetail = `${BASE_API_URL}/DesignAddon/Save_DesignAddon_ModularQuotaionDetail`
export const Delete_Modular_DesignAddon_UpGradeItemMapData = `${BASE_API_URL}/DesignAddon/Delete_Modular_DesignAddon_UpGradeItemMapData`
export const Again_Add_Deleted_Modular_DesignAddon_UpgradeItems_Details = `${BASE_API_URL}/DesignAddon/Again_Add_Deleted_Modular_DesignAddon_UpgradeItems_Details`
export const Add_Modular_DesignAddon_UpgradeItems_Details = `${BASE_API_URL}/DesignAddon/Add_Modular_DesignAddon_UpgradeItems_Details`

export function GetDegignAddon_Modular_QuotationListAPI(
  modularTypeID: number,
  employeeID: number,
  customerID: number,
  searchText: string
) {
  return axios.post(GetDegignAddon_Modular_QuotationList, {
    modularTypeID,
    employeeID,
    customerID,
    searchText,
  })
}

export function GetDegignAddon_Modular_QuotationList_ForAddAPI() {
  return axios.get(GetDegignAddon_Modular_QuotationList_ForAdd)
}

export function Delete_Modular_DesignAddon_Details_API(quotationDetailID: number) {
  return axios.post(Delete_Modular_DesignAddon_Details, {quotationDetailID})
}

export function Again_Add_Deleted_Modular_DesignAddon_Details_API(quotationDetailID: number) {
  return axios.post(Again_Add_Deleted_Modular_DesignAddon_Details, {quotationDetailID})
}

export function GetSave_DesignAddon_ModularQuotaionDetail_API(
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
  return axios.post(Save_DesignAddon_ModularQuotaionDetail, {
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

export function Delete_Modular_DesignAddon_UpGradeItemDeatils_API(dIYUpgrageItemMapID: number) {
  return axios.post(Delete_Modular_DesignAddon_UpGradeItemMapData, {dIYUpgrageItemMapID})
}

export function Again_Add_Deleted_Modular_DesignAddon_UpgradeItems_Details_API(
  dIYUpgrageItemMapID: number
) {
  return axios.post(Again_Add_Deleted_Modular_DesignAddon_UpgradeItems_Details, {
    dIYUpgrageItemMapID,
  })
}

export function Add_Modular_DesignAddon_UpgradeItems_Details_API(
  qutationID: number,
  upGradeItemID: number
) {
  return axios.post(Add_Modular_DesignAddon_UpgradeItems_Details, {
    qutationID,
    upGradeItemID,
  })
}
