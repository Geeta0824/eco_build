import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL
// =================Plan Ara URL=====================
export const Get_ModularProduct_List_By_Filter = `${BASE_API_URL}/ModularProduct/GetModularProductListFilter`
export const Create_Modular_Product = `${BASE_API_URL}/ModularProduct/AddModularProductDetails` //Add
export const Get_Modular_ProductCategoryBy_ModularTypeID = `${BASE_API_URL}/ModularProduct/GetModularProductCategoryByModularTypeID` //dropDown
export const Delete_Modular_Product = `${BASE_API_URL}/ModularProduct/DeleteModularProduct` //Delete
export const UPDATE_Modular_Product_Master = `${BASE_API_URL}/ModularProduct/UpdateModularProductDetails` //Update
export const GET_Modular_Produc_BY_Modular_Product_ID = `${BASE_API_URL}/ModularProduct/GetModularProductByProductID` //Get Data By id
export const ISACTIVE_Modular_Product = `${BASE_API_URL}/ModularProduct/UpdateModularProductIsactive` //Is Active
export const Export_Excel_Modular_Product_list = `${BASE_API_URL}/ModularProduct/ExportExcelModularProductListFilter` //Export excel
export const Upload_Modular_ProductExcel = `${BASE_API_URL}/ModularProduct/UploadModularProductExcel` //Export excel
export const Get_Asseccories_With_Modular_ProductID = `${BASE_API_URL}/ModularProduct/GetAsseccoriesWithModularProductID` //Export excel
export const Add_AccessoriesBy_Modular_ProductID = `${BASE_API_URL}/ModularProduct/AddAccessoriesByModularProductID` //Export excel

export function GetModularProductListByFilterAPI(
  productCategoryID: number,
  unitID: number,
  searchText: string
) {
  return axios.post(Get_ModularProduct_List_By_Filter, {productCategoryID, unitID, searchText})
}
export function getModularProductCategoryByModularTypeIDAPI(modularTypeID: number) {
  return axios.post(Get_Modular_ProductCategoryBy_ModularTypeID, {modularTypeID})
}

export function exportExcelModularProductMasterDataApi(
  productCategoryID: number,
  unitID: number,
  searchText: string
) {
  return axios.post(Export_Excel_Modular_Product_list, {productCategoryID, unitID, searchText})
}

export function createModularProductAPI(
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
  isActive: boolean,
  modularTypeID: number,
  ipAddress: string,
  createBy: number,
  agencyTypeID: number,
  agnecyPrice: number
) {
  return axios.post(Create_Modular_Product, {
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
    modularTypeID,
    ipAddress,
    createBy,
    agencyTypeID,
    agnecyPrice,
  })
}

export function getModularProductByModularproductID(productID: string) {
  return axios.post(GET_Modular_Produc_BY_Modular_Product_ID, {productID})
}

export function updateModularProductAPI(
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
  isActive: boolean,
  modularTypeID: number,
  ipAddress: string,
  updateBy: number,

  agencyTypeID:number,
  agnecyPrice:number,
) {
  return axios.post(UPDATE_Modular_Product_Master, {
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
    modularTypeID,
    ipAddress,
    updateBy,
    agencyTypeID,
    agnecyPrice,
    
  })
}

export function deleteModularProductAPI(productID: number) {
  return axios.post(Delete_Modular_Product, {productID})
}

export function isActiveModularProduct(productID: number, isActive: boolean) {
  return axios.post(ISACTIVE_Modular_Product, {productID, isActive})
}

export function UploadModularProductExcelAPI(modularTypeID: number) {
  return axios.post(Upload_Modular_ProductExcel, {modularTypeID})
}

export function GetAsseccoriesWithModularProductIDAPI(productID: number, modularTypeID: number) {
  return axios.post(Get_Asseccories_With_Modular_ProductID, {productID, modularTypeID})
}

export function AddAccessoriesByModularProductIDApi(accessories: string, productID: number) {
  return axios.post(Add_AccessoriesBy_Modular_ProductID, {accessories, productID})
}
