import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL
// =================Agency Type URL=====================
export const Get_AgencyWorkStage_By_TypeID = `${BASE_API_URL}/AgencyWorkStage/Get_AgencyWorkStage_By_TypeID`
export const CREATE_AGENCY_WorkStage = `${BASE_API_URL}/AgencyWorkStage/Add_AgencyWorkStage`
export const UPDATE_AGENCY_WorkStage = `${BASE_API_URL}/AgencyWorkStage/Update_AgencyWorkStage`
export const Get_AgencyWorkStage_By_AgencyWorkStageID = `${BASE_API_URL}/AgencyWorkStage/Get_AgencyWorkStage_By_AgencyWorkStageID`
export const Update_AgencyWorkStage_Isactive = `${BASE_API_URL}/AgencyWorkStage/Update_AgencyWorkStage_Isactive`
export const DELETE_AGENCY_WorkStage = `${BASE_API_URL}/AgencyWorkStage/Delete_AgencyWorkStage`

export function GetAgencyWorkStageByTypeIDApi(agencyTypeID: number) {
  return axios.post(Get_AgencyWorkStage_By_TypeID, {agencyTypeID})
}
export function AddAgencyWorkStageApi(
  agencyTypeID: number,
  stageName: string,
  workDetails: string,
  percentage: number,
  seqNo: number,
  isActive: boolean,
  createBy: number,
  ipAddress: string
) {
  return axios.post(CREATE_AGENCY_WorkStage, {
    agencyTypeID,
    stageName,
    workDetails,
    percentage,
    seqNo,
    isActive,
    createBy,
    ipAddress,
  })
}

export function UpdateAgencyWorkStageApi(
  agencyWorkStageID: number,
  agencyTypeID: number,
  stageName: string,
  workDetails: string,
  percentage: number,
  seqNo: number,
  isActive: boolean,
  updateBy: number,
  ipAddress: string
) {
  return axios.post(UPDATE_AGENCY_WorkStage, {
    agencyWorkStageID,
    agencyTypeID,
    stageName,
    workDetails,
    percentage,
    seqNo,
    isActive,
    updateBy,
    ipAddress,
  })
}
export function GetAgencyWorkStageByAgencyWorkStageIDApi(agencyWorkStageID: number) {
  return axios.post(Get_AgencyWorkStage_By_AgencyWorkStageID, {
    agencyWorkStageID,
  })
}
export function isActiveAgencyWorkStage(agencyWorkStageID: number, isActive: boolean) {
  return axios.post(Update_AgencyWorkStage_Isactive, {
    agencyWorkStageID,
    isActive,
  })
}

export function DeleteAgencyWorkStage(agencyWorkStageID: number) {
  return axios.post(DELETE_AGENCY_WorkStage, {
    agencyWorkStageID,
  })
}
