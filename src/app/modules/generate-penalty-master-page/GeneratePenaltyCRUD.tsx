import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL

// =====================Document Category URL======================
export const GetGeneratePenaltyList = `${BASE_API_URL}/GeneratePenalty/GetGeneratePenaltyList`
export const AddGeneratePenaltyDetails = `${BASE_API_URL}/GeneratePenalty/AddGeneratePenaltyDetails`
export const UpdateGeneratePenaltyDetails = `${BASE_API_URL}/GeneratePenalty/UpdateGeneratePenaltyDetails`
export const GetGeneratePenaltyByTicketID = `${BASE_API_URL}/GeneratePenalty/GetGeneratePenaltyByPenaltyID`
export const DeleteGeneratePenalty = `${BASE_API_URL}/GeneratePenalty/DeleteGeneratePenalty`
export const ApprovePenalty_ByDesigner_DM_Admin = `${BASE_API_URL}/GeneratePenalty/ApprovePenalty_ByDesigner_DM_Admin`
export const GetPenaltyStatusList = `${BASE_API_URL}/PenaltyType/GetPenaltyStatusList`

export function getGetGeneratePenaltyListAPI(
  roleID: number,
  designationID: number,
  employeeID: number
) {
  return axios.post(GetGeneratePenaltyList, {roleID, designationID, employeeID})
}

export function AddGeneratePenaltyDetailsAPI(
  projectID: number,
  designerID: number,
  penaltyTypeID: number,
  amount: number,
  remarks: string,
  penaltyBy: number,
  ipAddress: string,
  penaltyForID: number,
  approvalForID: number,
  departmentID: number
) {
  return axios.post(AddGeneratePenaltyDetails, {
    projectID,
    designerID,
    penaltyTypeID,
    amount,
    remarks,
    penaltyBy,
    ipAddress,
    penaltyForID,
    approvalForID,
    departmentID,
  })
}

export function UpdateGeneratePenaltyDetailsAPI(
  penaltyID: number,
  projectID: number,
  designerID: number,
  penaltyTypeID: number,
  amount: number,
  remarks: string,
  ipAddress: string,
  penaltyForID: number,
  approvalForID: number,
  departmentID: number
) {
  return axios.post(UpdateGeneratePenaltyDetails, {
    penaltyID,
    projectID,
    designerID,
    penaltyTypeID,
    amount,
    remarks,
    ipAddress,
    penaltyForID,
    approvalForID,
    departmentID,
  })
}

export function GetGeneratePenaltyByTicketIDAPI(penaltyID: number) {
  return axios.post(GetGeneratePenaltyByTicketID, {penaltyID})
}

export function DeleteGeneratePenaltyAPI(penaltyID: number) {
  return axios.post(DeleteGeneratePenalty, {penaltyID})
}

export function ApprovePenalty_ByDesigner_DM_AdminAPI(
  penaltyID: number,
  responseBy: number,
  statusID: number,
  ipAddress: string
) {
  return axios.post(ApprovePenalty_ByDesigner_DM_Admin, {
    penaltyID,
    responseBy,
    statusID,
    ipAddress,
  })
}

export function GetPenaltyStatusListAPI() {
  return axios.get(GetPenaltyStatusList)
}
