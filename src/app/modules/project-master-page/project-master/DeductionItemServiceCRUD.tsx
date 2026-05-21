import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL
// =================Department URL=====================
export const GET_ALL_Deduction_Item_List = `${BASE_API_URL}/ProjectReduction/GetProjectReductionListByProjectID`
export const Add_Deduction_Item_Details = `${BASE_API_URL}/ProjectReduction/AddProjectReductionDetails`
export const Edit_Deduction_Item_Details = `${BASE_API_URL}/ProjectReduction/UpdateProjectReductionDetails`
export const GET_Deduction_Item_By_Deduction_Item_ID = `${BASE_API_URL}/ProjectReduction/GetProjectReductionListByProjectReductionlItemID`
export const Delete_Deduction_Item_Data = `${BASE_API_URL}/ProjectReduction/DeleteProjectReductionDetails`

// =========================Get ProjectStatus_List=====================
export function getAllProjectReductionListAPI(projectID: number) {
  return axios.post(GET_ALL_Deduction_Item_List, {projectID})
}

export function AddProjectReductionDetailsAPI(
  projectID: number,
  reductionItemDescription: string,
  reductionAmount: number,
  createDate: string,
  createBy: number,
  ipAddress: string
) {
  return axios.post(Add_Deduction_Item_Details, {
    projectID,
    reductionItemDescription,
    reductionAmount,
    createDate,
    createBy,
    ipAddress,
  })
}
export function getProjectReductionByProjectReductionIdAPI(projectReductionlItemID: number) {
  return axios.post(GET_Deduction_Item_By_Deduction_Item_ID, {projectReductionlItemID})
}
export function EditProjectReductionDetailsAPI(
  projectID: number,
  projectReductionlItemID: number,
  reductionItemDescription: string,
  reductionAmount: number,
  createDate: string,
  updateBy: number,
  ipAddress: string
) {
  return axios.post(Edit_Deduction_Item_Details, {
    projectID,
    projectReductionlItemID,
    reductionItemDescription,
    reductionAmount,
    createDate,
    updateBy,
    ipAddress,
  })
}
export function deleteProjectReductionDataAPI(projectReductionlItemID: number) {
  return axios.post(Delete_Deduction_Item_Data, {projectReductionlItemID})
}
