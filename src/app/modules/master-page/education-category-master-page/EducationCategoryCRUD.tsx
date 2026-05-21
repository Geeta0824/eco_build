import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL
//=====================EduCategory URL======================
export const GET_ALL_EDU_CATEGORY = `${BASE_API_URL}/EduCategory/GetEduCategoryWebList` //Get EduCategory Page
export const POST_ADD_EDU_CATEGORY = `${BASE_API_URL}/EduCategory/AddEduCategoryDetails` //Create EduCategory Page
export const EDU_CATEGORY_DATA_BY_EDU_CATEGORY_ID = `${BASE_API_URL}/EduCategory/GetEduCategoryByEduCategoryID` //Update EduCategory Page
export const UPDATE_EDU_CATEGORY = `${BASE_API_URL}/EduCategory/UpdateEduCategoryDetails` //Update EduCategory Page
export const DELETE_EDU_CATEGORY = `${BASE_API_URL}/EduCategory/PostDeleteEduCategory` //Delete EduCategory Page
export const ISACTIVE_EDU_CATEGORY = `${BASE_API_URL}/EduCategory/UpdateEduCategoryIsactive` // Is Active EduCategory Page
export const GET_DROP_DOWN_EDU_CATEGORY = `${BASE_API_URL}/EduCategory/GetEduCategoryDropdownList` //Get EduCategory Page

// =========GET EduCategory=================================
export function getAllEduCategory() {
  return axios.get(GET_ALL_EDU_CATEGORY)
}
// =========GET EduCategory=================================
export function getDropDownEduCategory() {
  return axios.get(GET_DROP_DOWN_EDU_CATEGORY)
}
// =====================CREATE EduCategory===================
export function postEduCategory(
  EduCategoryName: string,
  isActive: boolean,
  createBy: number,
  ipAddress: string
) {
  return axios.post(POST_ADD_EDU_CATEGORY, {
    EduCategoryName,
    isActive,
    createBy,
    ipAddress,
  })
}
// =======================UPDATE EduCategory==================
export function getEduCategoryById(eduCategoryId: string) {
  return axios.post(EDU_CATEGORY_DATA_BY_EDU_CATEGORY_ID, {eduCategoryId})
}

export function updateEduCategory(
  EduCategoryID: number,
  EduCategoryName: string,
  isActive: boolean,
  updateBy: number,
  ipAddress: string
) {
  return axios.post(UPDATE_EDU_CATEGORY, {
    EduCategoryID,
    EduCategoryName,
    isActive,
    updateBy,
    ipAddress
  })
}
// =======================DELETE EduCategory==================
export function deleteEduCategory(eduCategoryId: number) {
  return axios.post(DELETE_EDU_CATEGORY, {eduCategoryId})
}
// =======================ISACTIVE EduCategory==================
export function isActiveEduCategory(eduCategoryID: number, isActive: boolean) {
  return axios.post(ISACTIVE_EDU_CATEGORY, {eduCategoryID, isActive})
}
