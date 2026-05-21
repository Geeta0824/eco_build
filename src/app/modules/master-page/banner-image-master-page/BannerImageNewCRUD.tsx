import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL
//=====================Item URL======================
export const GET_ALL_BANNER_IMAGE_new = `${BASE_API_URL}/Banner_New/Banner_GetList` //Get List
export const CREATE_BANNER_IMAGE_new = `${BASE_API_URL}/Banner_New/Banner_AddDetails` //Add
export const UPDATE_BANNER_IMAGE_new = `${BASE_API_URL}/Banner_New/Banner_UpdateDetails` //Update
export const UPDATE_BANNER_IMAGE_BY_BANNER_ID_Banner_New = `${BASE_API_URL}/Banner_New/Banner_GetBy_BannerID` //Grt By Id
export const IS_ACTIVE_BANNER_IMAGE_new = `${BASE_API_URL}/Banner_New/Banner_Updates_Isactive` //Iss Active
export const UPLOAD_BANNER_IMAGE = `${BASE_API_URL}/Banner/Banner_Upload_photo` //Upload Photo
export const DELETE_BANNER_IMAGE_new = `${BASE_API_URL}/Banner_New/Banner_Delete_Details` //Delete

// ============================================================================
export function GetBannerImageApi_new() {
  return axios.get(GET_ALL_BANNER_IMAGE_new)
}
// ============================================================================
export function CreateBannerImageApi_new(
  bannerTitle: string,
  bannerPath: string,
  isActive: boolean,
  createBy: number,
  ipAddress: string
) {
  return axios.post(CREATE_BANNER_IMAGE_new, {
    bannerTitle,
    bannerPath,
    isActive,
    createBy,
    ipAddress,
  })
}
// ============================================================================
export function updateBannerImageApi_new(encodedResponse: string) {
  return axios.post(UPDATE_BANNER_IMAGE_new, {
    encodedResponse,
  })
}

// ============================================================================
export function getBannerImageByBannerId_new(encodedResponse: string) {
  return axios.post(UPDATE_BANNER_IMAGE_BY_BANNER_ID_Banner_New, {encodedResponse})
}
// ============================================================================
export function deleteBannerImage_new(encodedResponse: string) {
  return axios.post(DELETE_BANNER_IMAGE_new, {encodedResponse})
}
// ============================================================================
export function IsActiveBanner_new(encodedResponse: string) {
  return axios.post(IS_ACTIVE_BANNER_IMAGE_new, {encodedResponse})
}
