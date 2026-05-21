import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL
export const GET_PAYMENT_STRUCTURE_MAP_LIST = `${BASE_API_URL}/PMCWorkStagePayStructureMap/GetPMCWorkStagePayStructureMapWebList`
export const ADD_PAYMENT_STRUCTURE_MAP_DETAILS = `${BASE_API_URL}/PMCWorkStagePayStructureMap/AddPMCWorkStagePayStructureMapDetails`
export const UPDATE_PAYMENT_STRUCTURE_MAP_DETAILS = `${BASE_API_URL}/PMCWorkStagePayStructureMap/UpdatePMCWorkStagePayStructureMapDetails`
export const DELETE_PAYMENT_STRUCTURE_MAP_DETAILS = `${BASE_API_URL}/PMCWorkStagePayStructureMap/PostDeletePMCWorkStagePayStructureMap`
export const GET_PAYMENT_STRUCTURE_MAP_BY_PMCWORKSTAGE_MAP_ID = `${BASE_API_URL}/PMCWorkStagePayStructureMap/getPMCWorkStagePayStructureMapByPMCWorkStageMapID`
export const GET_PAYMENT_STRUCTURE_MAP_BY_PMCWORKSTAGE_MAP_VENDER_ID = `${BASE_API_URL}/PMCWorkStagePayStructureMap/getPMCWorkStagePayStructureMapListByVenderID`

export function getVenderPaymentStructureMapList() {
  return axios.get(GET_PAYMENT_STRUCTURE_MAP_LIST)
}

export function addVenderPaymentStructureMapDetails(
  sequenceNo: number,
  stageName: string,
  vendorID: number,
  amtPercentage: number,
  createBy: number
) {
  return axios.post(ADD_PAYMENT_STRUCTURE_MAP_DETAILS, {
    sequenceNo,
    stageName,
    vendorID,
    amtPercentage,
    createBy,
  })
}

export function deleteVenderPaymentStructureMapDetails(pmcWorkStageMapID: number) {
  return axios.post(DELETE_PAYMENT_STRUCTURE_MAP_DETAILS, {
    pmcWorkStageMapID,
  })
}
export function getPMCWorkStagePayStructureMapByPMCWorkStageMapID(pmcWorkStageMapID: number) {
  return axios.post(GET_PAYMENT_STRUCTURE_MAP_BY_PMCWORKSTAGE_MAP_ID, {
    pmcWorkStageMapID,
  })
}
export function getPMCWorkStagePayStructureMapListByVenderID(venderID: number) {
  return axios.post(GET_PAYMENT_STRUCTURE_MAP_BY_PMCWORKSTAGE_MAP_VENDER_ID, {
    venderID,
  })
}
export function updateVenderPaymentStructureMapDetails(
  pmcWorkStageMapID: number,
  sequenceNo: number,
  stageName: string,
  vendorID: number,
  amtPercentage: number,
  updateBy: number
) {
  return axios.post(UPDATE_PAYMENT_STRUCTURE_MAP_DETAILS, {
    pmcWorkStageMapID,
    sequenceNo,
    stageName,
    vendorID,
    amtPercentage,
    updateBy,
  })
}
