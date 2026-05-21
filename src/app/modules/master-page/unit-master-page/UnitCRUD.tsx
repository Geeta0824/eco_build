import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL
// =================Emp Education URL=====================
export const GET_ALL_CARPET_AREA = `${BASE_API_URL}/Unit/GetUnitList`
export const GET_Active_CARPET_AREA = `${BASE_API_URL}/Unit/GetDropDownUnitList`
export const CREATE_CARPET_AREA = `${BASE_API_URL}/Unit/AddUnitDetails`
export const GET_CARPET_AREA_BY_CARPET_AREA_ID = `${BASE_API_URL}/Unit/GetUnitByUnitID`
export const UPDATE_CARPET_AREA = `${BASE_API_URL}/Unit/UpdateUnitDetails`
export const DELETE_CARPET_AREA = `${BASE_API_URL}/Unit/DeleteUnit`
export const ISACTIVE_CARPET_AREA = `${BASE_API_URL}/Unit/UpdateUnitIsactive`

export function getAllUnit() {
  return axios.get(GET_ALL_CARPET_AREA)
}

export function getActiveUnit() {
  return axios.get(GET_Active_CARPET_AREA)
}

export function createUnit(
  unitName: string,
  isActive: boolean,
  createBy: number,
  ipAddress: string
) {
  return axios.post(CREATE_CARPET_AREA, {unitName, isActive, createBy, ipAddress})
}

export function getUnitByUnitId(unitID: string) {
  return axios.post(GET_CARPET_AREA_BY_CARPET_AREA_ID, {unitID})
}
export function updateUnit(
  unitID: number,
  unitName: string,
  isActive: boolean,
  updateBy: number,
  ipAddress: string
) {
  return axios.post(UPDATE_CARPET_AREA, {
    unitID,
    unitName,
    isActive,
    updateBy,
    ipAddress,
  })
}
export function deleteUnit(unitID: number) {
  return axios.post(DELETE_CARPET_AREA, {unitID})
}
export function isActiveUnit(unitID: number, isActive: boolean) {
  return axios.post(ISACTIVE_CARPET_AREA, {unitID, isActive})
}
