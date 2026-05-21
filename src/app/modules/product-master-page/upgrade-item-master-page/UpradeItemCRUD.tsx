import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL
// =================Plan Ara URL=====================
export const GET_ALL_Upgrade_Item_By_QuoteID = `${BASE_API_URL}/UpGradeItem/GetUpGradeItemListByQuoteID`
export const Get_All_Modular_Product_UpGradeItem_List_ByQuoteID = `${BASE_API_URL}/UpGradeItem/GetModularProductUpGradeItemListByQuoteID`
export const GET_ALL_Upgrade_Item = `${BASE_API_URL}/UpGradeItem/GetUpGradeItemList`
export const Create_Upgrade_Item = `${BASE_API_URL}/UpGradeItem/AddUpGradeItemDetails`
export const Update_Upgrade_Item = `${BASE_API_URL}/UpGradeItem/UpdateUpGradeItemDetails`
export const Get_Upgrade_Item_By_UpgradeID = `${BASE_API_URL}/UpGradeItem/GetUpGradeItemByID`
export const Delete_Upgrade_Item = `${BASE_API_URL}/UpGradeItem/DeleteUpGradeItem`

export function getAllUpgradeItemByQuotationID(quotationID:number) {
  return axios.post(GET_ALL_Upgrade_Item_By_QuoteID,{quotationID})
}
export function getAllModularProductUpGradeItemListByQuoteID(quotationID:number) {
  return axios.post(Get_All_Modular_Product_UpGradeItem_List_ByQuoteID ,{quotationID})
}
export function getAllUpgradeItem() {
  return axios.get(GET_ALL_Upgrade_Item)
}
// ===================================================================================
export function CreateUpgradeItem(
  agencyTypeID: number,
  upGradeItemName: string,
  upGradePercentage: number,
  createBy: number,
  ipAddress: string
) {
  return axios.post(Create_Upgrade_Item, {
    agencyTypeID,
    upGradeItemName,
    upGradePercentage,
    createBy,
    ipAddress,
  })
}
// ===================================================================================
export function UpdateUpgradeItem(
  upGradeItemID: number,
  agencyTypeID: number,
  upGradeItemName: string,
  upGradePercentage: number,
  updateBy: number,
  ipAddress: string
) {
  return axios.post(Update_Upgrade_Item, {
    upGradeItemID,
    agencyTypeID,
    upGradeItemName,
    upGradePercentage,
    updateBy,
    ipAddress,
  })
}
// ===================================================================================
export function getUpgradeItemByUpgradeID(upGradeItemID: number) {
  return axios.post(Get_Upgrade_Item_By_UpgradeID, {
    upGradeItemID,
  })
}
// ===================================================================================
export function deleteUpgradeItem(upGradeItemID: number) {
  return axios.post(Delete_Upgrade_Item, {
    upGradeItemID,
  })
}
