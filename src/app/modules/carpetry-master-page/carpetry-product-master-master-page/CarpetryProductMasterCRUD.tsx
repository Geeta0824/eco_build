import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL
// =================Carpetry URL=====================
export const GET_TURNKEY_PRODUCT_LIST_BY_FILTER = `${BASE_API_URL}/CarpentryProduct/GetTurnkeyProductListFilter`
export const CREATE_Turnkey_Product_Master = `${BASE_API_URL}/CarpentryProduct/AddTurnkeyProductDetails`
// export const GET_ALL_Product_Master = `${BASE_API_URL}/Product/GetProductList`
export const GET_Turnkey_Product_Master_BY_Product_Master_ID = `${BASE_API_URL}/CarpentryProduct/GetTurnkeyProductByProductID`
export const UPDATE_Turnkey_Product_Master = `${BASE_API_URL}/CarpentryProduct/UpdateTurnkeyProductDetails`
export const DELETE_Turnkey_Product_Master = `${BASE_API_URL}/CarpentryProduct/DeleteTurnkeyProduct`
export const ISACTIVE_Turnkey_Product_Master = `${BASE_API_URL}/CarpentryProduct/UpdateTurnkeyProductIsactive`
export const Get_Area_With_Turnkey_Product_ID = `${BASE_API_URL}/CarpentryProduct/GetAreaWithTurnkeyProductID`
export const Add_Turnkey_Area_By_Product_ID = `${BASE_API_URL}/CarpentryProduct/AddAreaByTurnkeyProductID`
export const Turnkey_Product_Photo = `${BASE_API_URL}/CarpentryProduct/SaveTurnkeyProductPhoto`
export const EXPORT_EXCEL_PRODUCT_LIST = `${BASE_API_URL}/CarpentryProduct/ExportExcelProductListFilter`

// ===================== Carpetry ==================================
export function getTurnkeyProductListByFilter(
  productCategoryID: number,
  unitID: number,
  searchText: string
) {
  return axios.post(GET_TURNKEY_PRODUCT_LIST_BY_FILTER, {productCategoryID, unitID, searchText})
}

export function createTurnkeyProductMaster(
  productCategoryID: number,
  productName: string,
  photoPath: string,
  description: string,
  length: number,
  height: number,
  depth: number,
  sqft: string,
  pricePerSqFt: number,
  defaultUnitID: number,
  isHeightChange: boolean,
  isMandatory: boolean,
  isAskForQuote: boolean,
  isActive: boolean,
  noOfUnit: string
) {
  let ipAddress = '192.168.1.1'
  let createBy = 1
  return axios.post(CREATE_Turnkey_Product_Master, {
    productCategoryID,
    productName,
    photoPath,
    description,
    length,
    height,
    depth,
    sqft,
    pricePerSqFt,
    defaultUnitID,
    isHeightChange,
    isMandatory,
    isAskForQuote,
    isActive,
    noOfUnit,
    ipAddress,
    createBy,
  })
}

export function getTurnkeyProductMasterByproductID(productID: string) {
  return axios.post(GET_Turnkey_Product_Master_BY_Product_Master_ID, {productID})
}
export function updateTurnkeyProductMaster(
  productID: number,
  productCategoryID: number,
  productName: string,
  photoPath: string,
  description: string,
  length: number,
  height: number,
  depth: number,
  sqft: string,
  pricePerSqFt: number,
  defaultUnitID: number,
  isHeightChange: boolean,
  isMandatory: boolean,
  isAskForQuote: boolean,
  isActive: boolean,
  noOfUnit: string
) {
  let ipAddress = '192.168.1.1'
  let updateBy = 1
  return axios.post(UPDATE_Turnkey_Product_Master, {
    productID,
    productCategoryID,
    productName,
    photoPath,
    description,
    length,
    height,
    depth,
    sqft,
    pricePerSqFt,
    defaultUnitID,
    isHeightChange,
    isMandatory,
    isAskForQuote,
    isActive,
    noOfUnit,
    ipAddress,
    updateBy,
  })
}
export function deleteTurnkeyProductMaster(productID: number) {
  return axios.post(DELETE_Turnkey_Product_Master, {productID})
}

export function isActiveTurnkeyProductMaster(productID: number, isActive: boolean) {
  return axios.post(ISACTIVE_Turnkey_Product_Master, {productID, isActive})
}

export function GetAreaWithTurnkeyProductIDApi(productID: number) {
  return axios.post(Get_Area_With_Turnkey_Product_ID, {productID})
}

export function AddTurnkeyAreaByProductIDApi(areaIDs: string, productID: number) {
  return axios.post(Add_Turnkey_Area_By_Product_ID, {areaIDs, productID})
}

// -------------------------- Export Carpentry Product Excel ------------------------

export function exportExcelCarpenteryProductMasterDataApi(
  productCategoryID: number,
  unitID: number,
  searchText: string
) {
  return axios.post(EXPORT_EXCEL_PRODUCT_LIST, {productCategoryID, unitID, searchText})
}
