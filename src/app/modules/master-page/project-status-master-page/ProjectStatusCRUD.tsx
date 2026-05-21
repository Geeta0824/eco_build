import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL
// =================Department URL=====================
export const GET_ALL_ProjectStatus_List = `${BASE_API_URL}/ProjectStatus/GetProjectStatusList`
export const Add_ProjectStatus = `${BASE_API_URL}/ProjectStatus/AddProjectStatusDetails`
export const Edit_ProjectStatus = `${BASE_API_URL}/ProjectStatus/UpdateProjectStatusDetails`
export const GET_ProjectStatus_Data_By_ID = `${BASE_API_URL}/ProjectStatus/GetProjectStatusByProjectStatusID`
export const Delete_ProjectStatus_Data = `${BASE_API_URL}/ProjectStatus/PostDeleteProjectStatus`
export const Get_Project_StatusFor_DropDownList = `${BASE_API_URL}/ProjectStatus/GetProjectStatusForDropDownList`
// =========================Get ProjectStatus_List=====================
export function getAllProjectStatusDataAPI() {
  return axios.get(GET_ALL_ProjectStatus_List)
}

export function GetProjectStatusForDropDownListAPI() {
  return axios.get(Get_Project_StatusFor_DropDownList)
}
export function AddProjectStatusAPI(
  projectStatusName: string,
  seqNo: number,
  createBy: number,
  ipAddress: string
) {
  return axios.post(Add_ProjectStatus, {projectStatusName, seqNo, createBy, ipAddress})
}
export function getProjectStatusByProjectStatusIDAPI(projectStatusID: number) {
  return axios.post(GET_ProjectStatus_Data_By_ID, {projectStatusID})
}
export function EditProjectStatusDataAPI(
  projectStatusID: number,
  projectStatusName: string,
  seqNo: number,
  updateBy: number,
  ipAddress: string
) {
  return axios.post(Edit_ProjectStatus, {
    projectStatusID,
    projectStatusName,
    seqNo,
    updateBy,
    ipAddress,
  })
}
export function DeleteProjectStatusDataAPI(projectStatusID: number) {
  return axios.post(Delete_ProjectStatus_Data, {projectStatusID})
}
