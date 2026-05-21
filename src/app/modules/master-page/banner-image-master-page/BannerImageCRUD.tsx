import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL
//=====================Item URL======================
export const GET_ALL_BANNER_IMAGE = `${BASE_API_URL}/Banner/Banner_GetList` //Get List
export const CREATE_BANNER_IMAGE = `${BASE_API_URL}/Banner/Banner_AddDetails` //Add
export const UPDATE_BANNER_IMAGE = `${BASE_API_URL}/Banner/Banner_UpdateDetails` //Update
export const UPDATE_BANNER_IMAGE_BY_BANNER_ID = `${BASE_API_URL}/Banner/Banner_GetBy_BannerID` //Grt By Id
export const IS_ACTIVE_BANNER_IMAGE = `${BASE_API_URL}/Banner/Banner_Updates_Isactive` //Iss Active
export const UPLOAD_BANNER_IMAGE = `${BASE_API_URL}/Banner/Banner_Upload_photo` //Upload Photo
export const DELETE_BANNER_IMAGE = `${BASE_API_URL}/Banner/Banner_Delete_Details` //Delete

// ============================================================================
export function GetBannerImageApi() {
  return axios.get(GET_ALL_BANNER_IMAGE)
}
// ============================================================================
export function CreateBannerImageApi(
  bannerTitle: string,
  bannerPath: string,
  isActive: boolean,
  createBy: number,
  ipAddress: string
) {
  return axios.post(CREATE_BANNER_IMAGE, {
    bannerTitle,
    bannerPath,
    isActive,
    createBy,
    ipAddress,
  })
}
// ============================================================================
export function updateBannerImageApi(
  bannerID: number,
  bannerTitle: string,
  bannerPath: string,
  isActive: boolean,
  updateBy: number,
  ipAddress: string
) {
  return axios.post(UPDATE_BANNER_IMAGE, {
    bannerID,
    bannerTitle,
    bannerPath,
    isActive,
    updateBy,
    ipAddress,
  })
}
// ============================================================================
export function getBannerImageByBannerId(bannerID: number) {
  return axios.post(UPDATE_BANNER_IMAGE_BY_BANNER_ID, {bannerID})
}
// ============================================================================
export function deleteBannerImage(bannerID: number) {
  return axios.post(DELETE_BANNER_IMAGE, {bannerID})
}
// ============================================================================
export function IsActiveBanner(bannerID: number, isActive: boolean) {
  return axios.post(IS_ACTIVE_BANNER_IMAGE, {bannerID, isActive})
}
