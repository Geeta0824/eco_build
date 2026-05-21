import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL
// =================Emp Education URL=====================
export const GET_ALL_NATIONAL = `${BASE_API_URL}/Nationality/GetNationalityWebList`
export const CREATE_NATIONAL = `${BASE_API_URL}/Nationality/AddNationalityDetails`
export const GET_NATIONAL_BY_NATIONAL_ID = `${BASE_API_URL}/Nationality/GetNationalityByNationalityID`
export const UPDATE_NATIONAL = `${BASE_API_URL}/Nationality/UpdateNationalityDetails`
export const DELETE_NATIONAL = `${BASE_API_URL}/Nationality/PostDeleteNationality`
export const ISACTIVE_NATIONAL = `${BASE_API_URL}/Nationality/UpdateNationalityIsactive`

export function getAllNationality() {
  return axios.get(GET_ALL_NATIONAL)
}

export function createNationality(
  nationalityName: string,
  isActive: boolean,
  createBy: number,
  ipAddress: string
) {
  return axios.post(CREATE_NATIONAL, {nationalityName, isActive, createBy, ipAddress})
}

export function getNationalByNationalId(nationalityID: string) {
  return axios.post(GET_NATIONAL_BY_NATIONAL_ID, {nationalityID})
}
export function updateNationality(
  nationalityID: number,
  nationalityName: string,
  isActive: boolean,
  updateBy: number,
  ipAddress: string
) {
  return axios.post(UPDATE_NATIONAL, {
    nationalityID,
    nationalityName,
    isActive,
    updateBy,
    ipAddress,
  })
}
export function deleteNationality(nationalityID: number) {
  return axios.post(DELETE_NATIONAL, {nationalityID})
}
export function isActiveNationality(nationalityID: number, isActive: boolean) {
  return axios.post(ISACTIVE_NATIONAL, {nationalityID, isActive})
}
