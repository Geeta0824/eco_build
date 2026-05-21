import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL
// =================Plan Ara URL=====================
export const GET_ALL_ProductCategory = `${BASE_API_URL}/ModularProductCategory/GetModularProductCategoryList`//Modular List
export const Get_ModularType_Dropdown_List = `${BASE_API_URL}/ModularProductCategory/GetModularTypeDropdownList`//Modular DropDown
export const CREATE_ProductCategory = `${BASE_API_URL}/ModularProductCategory/AddModularProductCategoryDetails`//Add MOdular
export const GET_ProductCategory_BY_ProductCategory_ID = `${BASE_API_URL}/ModularProductCategory/GetModularProductCategoryByProductCategoryID`//GET List By ID
export const UPDATE_ProductCategory = `${BASE_API_URL}/ModularProductCategory/UpdateModularProductCategoryDetails`//Update Modular
export const DELETE_ProductCategory = `${BASE_API_URL}/ModularProductCategory/DeleteModularProductCategory`//Delete Modular

export const ISACTIVE_ProductCategory = `${BASE_API_URL}/ModularProductCategory/UpdateModularProductCategoryIsactive`//Is Active

export function getModularProductCategoryApi() {
  return axios.get(GET_ALL_ProductCategory)
}
export function getModularTypeListApi() {
  return axios.get(Get_ModularType_Dropdown_List)
}

export function createModularProductCategory(
 productCategoryName:string,
 photoPath:string,
 isActive:boolean,
 createBy:number,
 ipAddress:string,
 modularTypeID:number

) {
  return axios.post(CREATE_ProductCategory, {
    productCategoryName,
    photoPath,
    isActive,
    createBy,
    ipAddress,
    modularTypeID
  })
}

export function getModularProductCategoryByProductCategoryIdApi(productCategoryID: number) {
  return axios.post(GET_ProductCategory_BY_ProductCategory_ID, {productCategoryID})
}
export function updateModularProductCategory(
  productCategoryID: number,
  productCategoryName: string,
  photoPath: string,
  isActive: boolean,
  updateBy: number,
  ipAddress: string,
  modularTypeID:number
) {
  return axios.post(UPDATE_ProductCategory, {
    productCategoryID,
    productCategoryName,
    photoPath,
    isActive,
    updateBy,
    ipAddress,
    modularTypeID
  })
}
export function deleteModularProductCategory(productCategoryID: number) {
  return axios.post(DELETE_ProductCategory, {productCategoryID})
}
export function isActiveModularProductCategory(productCategoryID: number, isActive: boolean) {
  return axios.post(ISACTIVE_ProductCategory, {productCategoryID, isActive})
}
