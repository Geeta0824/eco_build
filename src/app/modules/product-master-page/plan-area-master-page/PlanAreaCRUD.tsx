import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL
// =================Plan Ara URL=====================
export const GET_ALL_CARPET_AREA = `${BASE_API_URL}/PlanArea/GetPlanAreaList`
export const CREATE_CARPET_AREA = `${BASE_API_URL}/PlanArea/AddPlanAreaDetails`
export const GET_CARPET_AREA_BY_CARPET_AREA_ID = `${BASE_API_URL}/PlanArea/GetPlanAreaByPlanAreaID`
export const UPDATE_CARPET_AREA = `${BASE_API_URL}/PlanArea/UpdatePlanAreaDetails`
export const DELETE_CARPET_AREA = `${BASE_API_URL}/PlanArea/DeletePlanArea`
export const ISACTIVE_CARPET_AREA = `${BASE_API_URL}/PlanArea/UpdatePlanAreaIsactive`
export const ISMANDATORY_CARPET_AREA = `${BASE_API_URL}/PlanArea/UpdatePlanAreaIsMandatory`

export function getAllPlanArea() {
  return axios.get(GET_ALL_CARPET_AREA)
}

export function createPlanArea(
  areaName: string,
  areaPrice: string,
  isActive: boolean,
  isMandatory:boolean,
  createBy: number,
  ipAddress: string
) {
  return axios.post(CREATE_CARPET_AREA, {areaName,areaPrice, isActive,isMandatory, createBy, ipAddress})
}

export function getPlanAreaByplanAreaId(planAreaID: string) {
  return axios.post(GET_CARPET_AREA_BY_CARPET_AREA_ID, {planAreaID})
}
export function updatePlanArea(
  planAreaID: number,
  areaName: string,
  areaPrice:string,
  isActive: boolean,
  isMandatory: boolean,
  updateBy: number,
  ipAddress: string
) {
  return axios.post(UPDATE_CARPET_AREA, {
    planAreaID,
    areaName,
    areaPrice,
    isActive,
    isMandatory,
    updateBy,
    ipAddress,
  })
}
export function deletePlanArea(planAreaID: number) {
  return axios.post(DELETE_CARPET_AREA, {planAreaID})
}
export function isActivePlanArea(planAreaID: number, isActive: boolean) {
  return axios.post(ISACTIVE_CARPET_AREA, {planAreaID, isActive})
}
export function isMandatoryPlanArea(planAreaID: number, isMandatory: boolean) {
  return axios.post(ISMANDATORY_CARPET_AREA, {planAreaID, isMandatory})
 
}
