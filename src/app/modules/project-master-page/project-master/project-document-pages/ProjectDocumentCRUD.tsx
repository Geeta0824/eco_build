import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL
// =================Department URL=====================
export const GET_ALL_Project_Document_List = `${BASE_API_URL}/ProjectDocument/GetProjectDocumentList`
export const Add_Project_Document_Details = `${BASE_API_URL}/ProjectDocument/AddProjectDocumentDetails`
export const Edit_Project_Document_Details = `${BASE_API_URL}/ProjectDocument/UpdateProjectDocumentDetails`
export const GET_Project_Document_By_Project_Document_ID = `${BASE_API_URL}/ProjectDocument/GetProjectDocumentByDocumentID`
export const Delete_Project_Document_Data = `${BASE_API_URL}/ProjectDocument/PostDeleteProjectDocument`

// =========================Get ProjectStatus_List=====================
export function getAllProjectDocumentListAPI(projectID:number) {
  return axios.post(GET_ALL_Project_Document_List,{projectID})
}
export function AddProjectDocumentDetailsAPI(
    projectID: number,
    docName: string,
    docPath: string,
  createBy: number,
  ipAddress: string
) {
  return axios.post(Add_Project_Document_Details, {
    projectID,
    docName,
    docPath,
    createBy,
    ipAddress,
  })
}
export function getProjectDocumentByProjectDocumentIdAPI(projectDocID: number) {
  return axios.post(GET_Project_Document_By_Project_Document_ID, {projectDocID})
}
export function EditProjectDocumentDetailsAPI(
  projectID: number,
  projectDocID: number,
  docName: string,
  docPath: string,
  updateBy: number,
  ipAddress: string
) {
  return axios.post(Edit_Project_Document_Details, {
    projectID,
    projectDocID,
    docName,
    docPath,
    updateBy,
    ipAddress,
  })
}
export function DeleteProjectDocumentDataAPI(projectDocID: number) {
  return axios.post(Delete_Project_Document_Data, {projectDocID})
}
