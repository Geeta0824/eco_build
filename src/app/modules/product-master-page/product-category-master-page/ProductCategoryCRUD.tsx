import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL
// =================Plan Ara URL=====================
export const GET_ALL_ProductCategory = `${BASE_API_URL}/ProductCategory/GetProductCategoryList`
export const GET_Active_ProductCategory = `${BASE_API_URL}/ProductCategory/GetDropDownProductCategoryList`
export const CREATE_ProductCategory = `${BASE_API_URL}/ProductCategory/AddProductCategoryDetails`
export const GET_ProductCategory_BY_ProductCategory_ID = `${BASE_API_URL}/ProductCategory/GetProductCategoryByproductCategoryID`
export const UPDATE_ProductCategory = `${BASE_API_URL}/ProductCategory/UpdateProductCategoryDetails`
export const DELETE_ProductCategory = `${BASE_API_URL}/ProductCategory/DeleteProductCategory`
export const ISACTIVE_ProductCategory = `${BASE_API_URL}/ProductCategory/UpdateProductCategoryIsactive`
export const Get_Multi_Drop_down_For_Carpetry_Product = `${BASE_API_URL}/MultipleDropdownList/GetCarpetry_Product_DropdownList_ForDropdown`

export function getMultiDropdownForCarpetryProdApi() {
  return axios.get(Get_Multi_Drop_down_For_Carpetry_Product)
}
export function getAllProductCategoryApi() {
  return axios.get(GET_ALL_ProductCategory)
}
export function getActiveProductCategoryApi() {
  return axios.get(GET_Active_ProductCategory)
}

export function createProductCategory(
  productCategoryName: string,
  photoPath: string,
  isActive: boolean,
  createBy: number,
  ipAddress: string
) {
  return axios.post(CREATE_ProductCategory, {
    productCategoryName,
    photoPath,
    isActive,
    createBy,
    ipAddress,
  })
}

export function getProductCategoryByProductCategoryIdApi(productCategoryID: string) {
  return axios.post(GET_ProductCategory_BY_ProductCategory_ID, {productCategoryID})
}
export function updateProductCategory(
  productCategoryID: number,
  productCategoryName: string,
  photoPath: string,
  isActive: boolean,
  updateBy: number,
  ipAddress: string
) {
  return axios.post(UPDATE_ProductCategory, {
    productCategoryID,
    productCategoryName,
    photoPath,
    isActive,
    updateBy,
    ipAddress,
  })
}
export function deleteProductCategory(productCategoryID: number) {
  return axios.post(DELETE_ProductCategory, {productCategoryID})
}
export function isActiveProductCategory(productCategoryID: number, isActive: boolean) {
  return axios.post(ISACTIVE_ProductCategory, {productCategoryID, isActive})
}
