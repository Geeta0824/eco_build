import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL
// =================AddonM  Master URL=====================
export const GET_ALL_ADDON_ITEM = `${BASE_API_URL}/AddonItemMst/GetAddonItemList`
export const ADD_ADDON_ITEM = `${BASE_API_URL}/AddonItemMst/AddAddonItemMst`
export const DELETE_ADDON_ITEM = `${BASE_API_URL}/AddonItemMst/DeleteAddonItem`
export const UPDATE_ADDON_ITEM = `${BASE_API_URL}/AddonItemMst/UpdateAddonItem`
export const GET_ADDON_ITEM_BY_ADDON_ITEM_ID = `${BASE_API_URL}/AddonItemMst/GetAddonItemMstByID`

// ======================= get Api===============================
export function getAddonItemApi() {
  return axios.get(GET_ALL_ADDON_ITEM)
}

// ======================== Create Api ===========================
export function AddAddonItemApi(
  addonItemName: string,
  itemPrice: number,
  filePath: string,
  productCategoryID: number,
  createBy: number,
  ipAddress: string
) {
  return axios.post(ADD_ADDON_ITEM, {
    addonItemName,
    itemPrice,
    filePath,
    productCategoryID,
    createBy,
    ipAddress,
  })
}

// ========================Update Api ===========================
export function UpdateAddonItemApi(
  addonItemID: number,
  addonItemName: string,
  itemPrice: number,
  filePath: string,
  productCategoryID: number,
  updateBy: number,
  ipAddress: string
) {
  return axios.post(UPDATE_ADDON_ITEM, {
    addonItemID,
    addonItemName,
    itemPrice,
    filePath,
    productCategoryID,
    updateBy,
    ipAddress,
  })
}

export function getAddonItemByIdApi(addonItemID: number) {
  return axios.post(GET_ADDON_ITEM_BY_ADDON_ITEM_ID, {addonItemID})
}
// ======================== Delete Api ===========================
export function DeleteAddonItemApi(addonItemID: number) {
  return axios.post(DELETE_ADDON_ITEM, {addonItemID})
}
