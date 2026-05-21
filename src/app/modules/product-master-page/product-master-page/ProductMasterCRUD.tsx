import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL
// =================Plan Ara URL=====================
export const GET_ALL_Product_Master = `${BASE_API_URL}/Product/GetProductList`
export const CREATE_Product_Master = `${BASE_API_URL}/Product/AddProductDetails`
export const GET_Product_Master_BY_Product_Master_ID = `${BASE_API_URL}/Product/GetProductByProductID`
export const UPDATE_Product_Master = `${BASE_API_URL}/Product/UpdateProductDetails`
export const DELETE_Product_Master = `${BASE_API_URL}/Product/DeleteProduct`
export const ISACTIVE_Product_Master = `${BASE_API_URL}/Product/UpdateProductIsactive`
export const GET_PRODUCT_LIST_BY_FILTER = `${BASE_API_URL}/Product/GetProductListFilter`
export const EXPORT_EXCEL_PRODUCT_LIST = `${BASE_API_URL}/Product/ExportExcelProductListFilter`
export const Get_Area_With_Product_ID = `${BASE_API_URL}/Product/GetAreaWithProductID`
export const Add_Area_By_Product_ID = `${BASE_API_URL}/Product/AddAreaByProductID`
export const Get_Accessories_With_Product_ID = `${BASE_API_URL}/Product/GetAsseccoriesWithProductID`
export const Add_Accessories_By_Product_ID = `${BASE_API_URL}/Product/AddAccessoriesByProductID`
export const GET_Active_CARPET_AREA = `${BASE_API_URL}/Unit/GetDropDownUnitList`

export function getAllProductMaster() {
  return axios.get(GET_ALL_Product_Master)
}

export function exportExcelProductMasterDataApi(
  productCategoryID: number,
  unitID: number,
  searchText: string
) {
  return axios.post(EXPORT_EXCEL_PRODUCT_LIST, {productCategoryID, unitID, searchText})
}

export function getProductListByFilter(
  productCategoryID: number,
  unitID: number,
  searchText: string
) {
  return axios.post(GET_PRODUCT_LIST_BY_FILTER, {productCategoryID, unitID, searchText})
}

export function createProductMaster(
  productCategoryID: number,
  productName: string,
  photoPath: string,
  description: string,
  length: number,
  height: number,
  depth: number,
  sqft: number,
  pricePerSqFt: number,
  defaultUnitID: number,
  isHeightChange: boolean,
  isMandatory: boolean,
  isAskForQuote: boolean,
  agencyTypeID: number,
  agnecyPrice: string,
  isActive: boolean,
  isMinLength: boolean,
  isMinHeight: boolean,
  isMinTotalSqft: boolean,
  isCrarpetArea: boolean,
  minLength: number,
  minHeight: number,
  minTotalUnit: number
) {
  let ipAddress = '192.168.1.1'
  let createBy = 1
  return axios.post(CREATE_Product_Master, {
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
    agencyTypeID,
    agnecyPrice,
    isActive,
    isMinLength,
    isMinHeight,
    isMinTotalSqft,
    isCrarpetArea,
    minLength,
    minHeight,
    minTotalUnit,
    ipAddress,
    createBy,
  })
}

export function getProductMasterByproductID(productID: string) {
  return axios.post(GET_Product_Master_BY_Product_Master_ID, {productID})
}
export function updateProductMaster(
  productID: number,
  productCategoryID: number,
  productName: string,
  photoPath: string,
  description: string,
  length: number,
  height: number,
  depth: number,
  sqft: number,
  pricePerSqFt: number,
  defaultUnitID: number,
  isHeightChange: boolean,
  isMandatory: boolean,
  isAskForQuote: boolean,
  agencyTypeID: number,
  agnecyPrice: string,
  isActive: boolean,
  isMinLength: boolean,
  isMinHeight: boolean,
  isMinTotalSqft: boolean,
  isCrarpetArea: boolean,
  minLength: number,
  minHeight: number,
  minTotalUnit: number
) {
  let ipAddress = '192.168.1.1'
  let updateBy = 1
  return axios.post(UPDATE_Product_Master, {
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
    agencyTypeID,
    agnecyPrice,
    isActive,
    isMinLength,
    isMinHeight,
    isMinTotalSqft,
    isCrarpetArea,
    minLength,
    minHeight,
    minTotalUnit,
    ipAddress,
    updateBy,
  })
}
export function deleteProductMaster(productID: number) {
  return axios.post(DELETE_Product_Master, {productID})
}

export function isActiveProductMaster(productID: number, isActive: boolean) {
  return axios.post(ISACTIVE_Product_Master, {productID, isActive})
}

export function GetAreaWithProductIDApi(productID: number) {
  return axios.post(Get_Area_With_Product_ID, {productID})
}

export function AddAreaByProductIDApi(areaIDs: string, productID: number) {
  return axios.post(Add_Area_By_Product_ID, {areaIDs, productID})
}

export function GetAccessoriesWithProductIDApi(productID: number) {
  return axios.post(Get_Accessories_With_Product_ID, {productID})
}

export function AddAccessoriesByProductIDApi(accessories: string, productID: number) {
  return axios.post(Add_Accessories_By_Product_ID, {accessories, productID})
}
