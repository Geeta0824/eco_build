import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL
// =================DesignStage URL=====================
export const GET_ALL_Design_Stage = `${BASE_API_URL}/DesignStage/GetDesignStageWebList`
export const GET_Design_Stage_BY_Design_Stage_ID = `${BASE_API_URL}/DesignStage/GetDesignStageByDesignStageID`
export const DELETE_Design_Stage_DETAILS = `${BASE_API_URL}/DesignStage/DeleteDesignStage`
export const UPDATE_Design_Stage = `${BASE_API_URL}/DesignStage/UpdateDesignStageDetails`
export const ADD_Design_Stage = `${BASE_API_URL}/DesignStage/AddDesignStageDetails`

export function getAllDesignStage() {
  return axios.get(GET_ALL_Design_Stage)
}

export function getDesignStageByDesignStageId(designStageID: number) {
  return axios.post(GET_Design_Stage_BY_Design_Stage_ID, {designStageID})
}
export function deleteDesignStageDetails(designStageID: number) {
  return axios.post(DELETE_Design_Stage_DETAILS, {designStageID})
}
export function updateDesignStage(designStageID: number,
  title: string,
  updateBy: number,
  ipAddress: string
) {
  return axios.post(UPDATE_Design_Stage, {
    designStageID,
    title,
    updateBy,
    ipAddress,
  })
}
export function AddDesignStageAPI(title: string, createBy: number, ipAddress: string) {
  return axios.post(ADD_Design_Stage, {
    title,
    createBy,
    ipAddress,
  })
}
