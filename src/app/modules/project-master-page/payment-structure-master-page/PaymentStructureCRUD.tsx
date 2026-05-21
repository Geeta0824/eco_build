import axios from 'axios'

const BASE_API_URL = process.env.REACT_APP_API_URL
// =================Department URL=====================
export const GET_Project_Payment_Structure_List = `${BASE_API_URL}/ProjectPaymentStructure/GetPaymentStructureListByID`
export const ADD_Project_Payment_Structure_By_Project_ID = `${BASE_API_URL}/ProjectPaymentStructure/AddProjectPaymentStructureByProjectID`
export const DELETE_Project_Payment_Structure_By_ID = `${BASE_API_URL}/ProjectPaymentStructure/DeleteProjectPaymentStructureByID`
export const UPDATE_Project_Payment_Structure_By_Project_ID = `${BASE_API_URL}/ProjectPaymentStructure/UpdateProjectPaymentStructureByProjectID`
export const GET_Project_Payment_Structure_BY_ID = `${BASE_API_URL}/ProjectPaymentStructure/GetPrjPayStructureByID`

export function ProjectPaymentStructureList(projectID: number) {
  return axios.post(GET_Project_Payment_Structure_List, {
    projectID,
  })
}

export function AddProjectPaymentStructureByProjectID(
  projectID: number,
  sequenceNo: number,
  stageName: string,
  amtPercentage: number,
  createBy: number
) {
  return axios.post(ADD_Project_Payment_Structure_By_Project_ID, {
    projectID,
    sequenceNo,
    stageName,
    amtPercentage,
    createBy,
  })
}
export function GetPrjPayStructuretByID(projectPaymentStructureID: number) {
  return axios.post(GET_Project_Payment_Structure_BY_ID, {
    projectPaymentStructureID,
  })
}

export function UpdateProjectPaymentStructureByProjectID(
  projectPaymentStructureID: number,
  sequenceNo: number,
  stageName: string,
  amtPercentage: number,
  updateBy: number
) {
  return axios.post(UPDATE_Project_Payment_Structure_By_Project_ID, {
    projectPaymentStructureID,
    sequenceNo,
    stageName,
    amtPercentage,
    updateBy,
  })
}
export function DeleteProjectPaymentStructureByID(projectPaymentStructureID: number) {
  return axios.post(DELETE_Project_Payment_Structure_By_ID, {
    projectPaymentStructureID,
  })
}
