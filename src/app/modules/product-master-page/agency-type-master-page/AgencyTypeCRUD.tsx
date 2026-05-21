import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL
// =================Agency Type URL=====================
export const GET_ALL_AGENCY_TYPE = `${BASE_API_URL}/AgencyType/GetAgencyTypeList`
export const CREATE_AGENCY_TYPE = `${BASE_API_URL}/AgencyType/AddAgencyTypeDetails`
export const GET_AGENCY_TYPE_BY_AGENCY_TYPE_ID = `${BASE_API_URL}/AgencyType/GetAgencyTypeByAgencyTypeID`
export const UPDATE_AGENCY_TYPE = `${BASE_API_URL}/AgencyType/UpdateAgencyTypeDetails`
export const DELETE_AGENCY_TYPE = `${BASE_API_URL}/AgencyType/PostDeleteAgencyType`
export const ISACTIVE_AGENCY_TYPE = `${BASE_API_URL}/AgencyType/UpdateAgencyTypeIsactive`
export const ISKAZULENCIA_AGENCY_TYPE = `${BASE_API_URL}/AgencyType/UpdateAgencyTypeIskazulencia`

export const Get_Product_Category_With_Agency_Type_ID = `${BASE_API_URL}/AgencyType/GetProductCategoryWithAgencyID`
export const Add_Product_Category_By_Agency_Type_ID = `${BASE_API_URL}/AgencyType/AddProductCategpryByAgencyTypeID`

export function getAllAgencyType() {
  return axios.get(GET_ALL_AGENCY_TYPE)
}

export function createAgencyType(
  agencyTypeName: string,
  adminCommissionPercentage: string,
  isActive: boolean,
  isKazulencia: boolean,
  createBy: number,
  ipAddress: string
) {
  return axios.post(CREATE_AGENCY_TYPE, {
    agencyTypeName,
    adminCommissionPercentage,
    isActive,
    isKazulencia,
    createBy,
    ipAddress,
  })
}

export function getAgencyTypeByAgencyTypeId(agencyTypeID: number) {
  return axios.post(GET_AGENCY_TYPE_BY_AGENCY_TYPE_ID, {agencyTypeID})
}

export function updateAgencyType(
  agencyTypeID:number,
  agencyTypeName: string,
  adminCommissionPercentage: string,
  isActive: boolean,
  isKazulencia: boolean,
  updateBy: number,
  ipAddress: string
) {
  return axios.post(UPDATE_AGENCY_TYPE, {
    agencyTypeID,
    agencyTypeName,
    adminCommissionPercentage,
    isActive,
    isKazulencia,
    updateBy,
    ipAddress,
  })
}
export function deleteAgencyType(agencyTypeID: number) {
  return axios.post(DELETE_AGENCY_TYPE, {agencyTypeID})
}
export function isActiveAgencyType(agencyTypeID: number, isActive: boolean) {
  return axios.post(ISACTIVE_AGENCY_TYPE, {agencyTypeID, isActive})
}
export function iskazulenciaAgencyType(agencyTypeID: number, isKazulencia: boolean) {
  return axios.post(ISKAZULENCIA_AGENCY_TYPE, {agencyTypeID, isKazulencia})
}

export function GetProductCategoryWithAgencyTypeIDApi(agencyTypeID: number) {
  return axios.post(Get_Product_Category_With_Agency_Type_ID, {agencyTypeID})
}

export function AddProductCategoryByAgencyTypeIDApi(productCategoryID: string, agencyTypeID: number) {
  return axios.post(Add_Product_Category_By_Agency_Type_ID, {productCategoryID, agencyTypeID})
}