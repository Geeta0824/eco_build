import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL
//=====================Quotation Master URL======================

export const GET_ALL_Quot_Master = `${BASE_API_URL}/QuotationCateogry/GetDropDownUnitList` //Get Quotation Master Page
export const Quotation_Master_DATA_BY_Quot_Master_ID = `${BASE_API_URL}/QuotationCateogry/GeQuotationCategoryList_QuotationCategoryID` //Update Quotation Master Page
export const UPDATE_Quot_Master = `${BASE_API_URL}/QuotationCateogry/UpdateQuotationCategoryDetalis` //Update Quotation Master Page
export const GET_ALL_ProjectType_Master = `${BASE_API_URL}/Project/GetAllProjectTypeMasterList` //Update Quotation Master Page
export const GeProjectTypeList_ProjectTypeID = `${BASE_API_URL}/Project/GeProjectTypeList_ProjectTypeID` //Update Quotation Master Page
export const Update_ProjectTypeDetalis_Master = `${BASE_API_URL}/Project/UpdateProjectTypeDetalis` //Update Quotation Master Page
export const Add_ProjectTypeDetalis_Master = `${BASE_API_URL}/Project/AddProjectTypeDetalis` //Update Quotation Master Page
export const update_IsActiveProjectType = `${BASE_API_URL}/Project/update_IsActiveProjectType` //Update Quotation Master Page

// ========= GET Quotation Master =================================
export function getAllQuoMasterApi() {
  return axios.get(GET_ALL_Quot_Master)
}

// =======================UPDATE Quotation Master==================
export function getQuoMasterDataByQuoMasterID(quotationCategoryID: number) {
  return axios.post(Quotation_Master_DATA_BY_Quot_Master_ID, {
    quotationCategoryID,
  })
}

// ======================================================
export function updateQuoMasterApi(
  quotationCategoryID: number,
  quotationCategoryName: string,
  updateBy: number,
  ipAddress: string
) {
  return axios.post(UPDATE_Quot_Master, {
    quotationCategoryID,
    quotationCategoryName,
    updateBy,
    ipAddress,
  })
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
  quotationLevelID: number,
  projectType: string,
  quotationLevelName: string,
  isActive: boolean,
  updateBy: number,
  ipAddress: string
) {
  return axios.post(Update_ProjectTypeDetalis_Master, {
    projectTypeID,
    quotationLevelID,
    projectType,
    quotationLevelName,
    isActive,
    updateBy,
    ipAddress,
  })
}

// ======================================================
export function addProjectTypeMasterApi(
  quotationLevelID: number,
  projectType: string,
  isActive: boolean,
  updateBy: number,
  ipAddress: string
) {
  return axios.post(Add_ProjectTypeDetalis_Master, {
    quotationLevelID,
    projectType,
    isActive,
    updateBy,
    ipAddress,
  })
}
