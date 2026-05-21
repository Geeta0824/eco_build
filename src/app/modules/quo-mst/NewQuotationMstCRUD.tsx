import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL
//=====================Quotation Master URL======================

export const GET_ALL_Quot_Master = `${BASE_API_URL}/QuotationCateogry_New/GetDropDownUnitList` //Get Quotation Master Page
export const Quotation_Master_DATA_BY_Quot_Master_ID = `${BASE_API_URL}/QuotationCateogry_New/GeQuotationCategoryList_QuotationCategoryID` //Update Quotation Master Page
export const UPDATE_Quot_Master = `${BASE_API_URL}/QuotationCateogry_New/UpdateQuotationCategoryDetalis` //Update Quotation Master Page
export const GET_ALL_ProjectType_Master = `${BASE_API_URL}/Project/GetAllProjectTypeMasterList` //Update Quotation Master Page
export const GeProjectTypeList_ProjectTypeID = `${BASE_API_URL}/Project/GeProjectTypeList_ProjectTypeID` //Update Quotation Master Page
export const Update_ProjectTypeDetalis_Master = `${BASE_API_URL}/Project/UpdateProjectTypeDetalis` //Update Quotation Master Page
export const update_IsActiveProjectType = `${BASE_API_URL}/Project/update_IsActiveProjectType` //Update Quotation Master Page

// ========= GET Quotation Master =================================
export function getAllQuoMasterApi() {
  return axios.get(GET_ALL_Quot_Master)
}

// =======================UPDATE Quotation Master==================
export function getQuoMasterDataByQuoMasterID(encodedReq: string) {
  return axios.post(Quotation_Master_DATA_BY_Quot_Master_ID, {
    encodedReq,
  })
}

// ======================================================
export function updateQuoMasterApi(encodedReq: string) {
  return axios.post(UPDATE_Quot_Master, {encodedReq})
}

// ========= GET Quotation Master =================================
export function getAllProjectTypeMasterApi() {
  return axios.get(GET_ALL_ProjectType_Master)
}
// =======================UPDATE ProjectType Master==================
export function getProjectTypeMasterDataByProjectTypeID(projectTypeID: number) {
  return axios.post(GeProjectTypeList_ProjectTypeID, {
    projectTypeID,
  })
}

// =======================UPDATE ProjectType Master==================
export function isActiveProjectTypeApi(projectTypeID: number, isActive: boolean) {
  return axios.post(update_IsActiveProjectType, {
    projectTypeID,
    isActive,
  })
}

// ======================================================
export function updateProjectTypeMasterApi(
  projectTypeID: number,
  projectType: string,
  isActive: boolean,
  updateBy: number,
  ipAddress: string
) {
  return axios.post(Update_ProjectTypeDetalis_Master, {
    projectTypeID,
    projectType,
    isActive,
    updateBy,
    ipAddress,
  })
}
