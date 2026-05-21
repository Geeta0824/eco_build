import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL
// =================Agency Type URL=====================
export const GET_ALL_AGENCY_STAGE_MATERIAL = `${BASE_API_URL}/AgencyStageMaterial/GetAgencyStageMaterialList`
export const CREATE_AGENCY_STAGE_MATERIAL = `${BASE_API_URL}/AgencyStageMaterial/AddAgencyStageMaterialDetails`
export const GET_AGENCY_STAGE_MATERIAL_BY_AGENCY_STAGE_MATERIAL_ID = `${BASE_API_URL}/AgencyStageMaterial/GetAgencyStageMaterialByID`
export const UPDATE_AGENCY_STAGE_MATERIAL = `${BASE_API_URL}/AgencyStageMaterial/UpdateAgencyStageMaterialDetails`
export const DELETE_AGENCY_STAGE_MATERIAL = `${BASE_API_URL}/AgencyStageMaterial/PostDeleteAgencyStageMaterial`

export function getAllStageMaterial(agencyWorkStageID:number) {
  return axios.post(GET_ALL_AGENCY_STAGE_MATERIAL,{agencyWorkStageID})
}

export function createStageMaterialApi(
  agencyWorkStageID: number,
  materialName: string,
  materialCompanyName: string,
  createBy: number,
  createDate: string
) {
  return axios.post(CREATE_AGENCY_STAGE_MATERIAL, {
    agencyWorkStageID,
    materialName,
    materialCompanyName,
    createBy,
    createDate,
  })
}

export function getStageMaterialByStageMaterialId(agencyStageWiseMaterialID: number) {
  return axios.post(GET_AGENCY_STAGE_MATERIAL_BY_AGENCY_STAGE_MATERIAL_ID, {agencyStageWiseMaterialID})
}

export function updateStageMaterial(
  agencyStageWiseMaterialID :number,
  agencyWorkStageID:number,
  materialName: string,
  materialCompanyName: string,
) {
  return axios.post(UPDATE_AGENCY_STAGE_MATERIAL, {
    agencyStageWiseMaterialID,
    agencyWorkStageID,
    materialName,
    materialCompanyName,
  })
}

export function deleteStageMaterial(agencyStageWiseMaterialID: number) {
  return axios.post(DELETE_AGENCY_STAGE_MATERIAL,{agencyStageWiseMaterialID})
}