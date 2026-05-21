import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL
// =================Emp Education URL=====================
export const GET_ALL_BHK = `${BASE_API_URL}/BHK/GetBHKList`
export const GET_ACTIVE_BHK = `${BASE_API_URL}/BHK/GetDropDownBHKList`
export const CREATE_BHK = `${BASE_API_URL}/BHK/AddBHKDetails`
export const GET_BHK_BY_BHK_ID = `${BASE_API_URL}/BHK/GetBHKBybhkID`
export const UPDATE_BHK = `${BASE_API_URL}/BHK/UpdateBHKDetails`
export const DELETE_BHK = `${BASE_API_URL}/BHK/DeleteBHK`
export const ISACTIVE_BHK = `${BASE_API_URL}/BHK/UpdateBHKIsactive`

export function getAllBHK() {
  return axios.get(GET_ALL_BHK)
}

export function getActiveBHKApi() {
  return axios.get(GET_ACTIVE_BHK)
}

export function createBHK(
  bhkName: string,
  isActive: boolean,
  createBy: number,
  ipAddress: string
) {
  return axios.post(CREATE_BHK, {bhkName, isActive, createBy, ipAddress})
}

export function getBHKByBHKId(bhkid: string) {
  return axios.post(GET_BHK_BY_BHK_ID, {bhkid})
}
export function updateBHK(
  bhkid: number,
  bhkName: string,
  isActive: boolean,
  updateBy: number,
  ipAddress: string
) {
  return axios.post(UPDATE_BHK, {
    bhkid,
    bhkName,
    isActive,
    updateBy,
    ipAddress,
  })
}
export function deleteBHK(bhkid: number) {
  return axios.post(DELETE_BHK, {bhkid})
}
export function isActiveBHK(bhkid: number, isActive: boolean) {
  return axios.post(ISACTIVE_BHK, {bhkid, isActive})
}
