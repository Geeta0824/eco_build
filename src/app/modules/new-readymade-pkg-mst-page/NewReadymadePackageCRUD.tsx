import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL
//=====================New Customer URL======================
export const GET_ALL_RReady_made_Package_Type = `${BASE_API_URL}/ReadymadePackageType_New/GetReadymadePackageTypeList`
export const ISACTIVE_RReady_made_Package_Type= `${BASE_API_URL}/ReadymadePackageType_New/UpdateReadymadePackageTypeIsactive`
export const DELETE_Ready_made_Package_Type = `${BASE_API_URL}/ReadymadePackageType_New/DeleteReadymadePackageType`
export const ADD_Ready_made_Package_Type = `${BASE_API_URL}/ReadymadePackageType_New/AddReadymadePackageTypeDetails_new`
export const UPDATE_Ready_made_Package_Type = `${BASE_API_URL}/ReadymadePackageType_New/UpdateReadymadePackageTypeDetails`
export const GET_Ready_made_Package_Type_BY_Ready_made_Package_Type_ID = `${BASE_API_URL}/ReadymadePackageType_New/GetReadymadePackageTypeByReadymadeTypeID`
export const Get_Bhk_Ready_made_Package_Type_Map = `${BASE_API_URL}/ReadymadePackageType_New/GetBhkWithReadymadeTypeIDMap`
export const Add_Bhk_Ready_made_Package_Type_Map = `${BASE_API_URL}/ReadymadePackageType_New/AddBhkByReadymadePackageTypeMap`
export const Get_Product_Ready_made_Package_Type_Map = `${BASE_API_URL}/ReadymadePackageType_New/GetProductWithReadymadeTypeIDMap`
export const Add_Product_Ready_made_Package_Type_Map = `${BASE_API_URL}/ReadymadePackageType_New/AddProductByReadymadePackageTypeMap`



export function GetReadymadePackageTypeApi() {
  return axios.get(GET_ALL_RReady_made_Package_Type)
}
export function deleteReadymadePackageType(encodedReq: string) {
  return axios.post(DELETE_Ready_made_Package_Type, {encodedReq})
}
export function isActive(encodedReq: string) {
  return axios.post(ISACTIVE_RReady_made_Package_Type, {encodedReq})
}
export function addReadymadePackageType(encodedReq: string) {
  return axios.post(ADD_Ready_made_Package_Type, {
    encodedReq,
  })
}
export function updateReadymadePackageType(encodedReq: string) {
  return axios.post(UPDATE_Ready_made_Package_Type, {
    encodedReq,
  })
}

export function getReadymadePackageTypeByReadymadePackageTypeIDApi(encodedReq: string) {
  return axios.post(GET_Ready_made_Package_Type_BY_Ready_made_Package_Type_ID, {encodedReq})
}

export function getbhkListWithNewReadymadePkgTypeIDApi(ReadymadeTypeID: number) {
  return axios.post(Get_Bhk_Ready_made_Package_Type_Map, {
    ReadymadeTypeID,
  })
}
export function AddBhkByReadymadePackageTypeMapApi(readymadeTypeID: number,bhkIDs:string) {
  return axios.post(Add_Bhk_Ready_made_Package_Type_Map, {
    readymadeTypeID,bhkIDs
  })
}

export function getProductListWithNewReadymadePkgTypeIDApi(readymadeTypeID: number) {
  return axios.post(Get_Product_Ready_made_Package_Type_Map, {
    readymadeTypeID,
  })
}
export function AddProductByReadymadePackageTypeMapApi(readymadeTypeID: number,productIDs:string) {
  return axios.post(Add_Product_Ready_made_Package_Type_Map, {
    readymadeTypeID,productIDs
  })
}