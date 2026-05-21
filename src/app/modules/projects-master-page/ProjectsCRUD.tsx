import axios from 'axios'
import {create} from 'domain'
const BASE_API_URL = process.env.REACT_APP_API_URL
// =================Emp Education URL=====================
export const Get_All_Project_List = `${BASE_API_URL}/Project/Project_GetList`
export const Add_Project_Details = `${BASE_API_URL}/Project/Project_AddDetails`
export const Edit_Project_Details = `${BASE_API_URL}/Project/Project_UpdateDetails`
export const Delete_Project_Details = `${BASE_API_URL}/Project/Project_Delete_Details`
export const Get_Project_By_Id = `${BASE_API_URL}/Project/Project_GetBy_ProjectID`
export const project_Update_Isactive = `${BASE_API_URL}/Project/Project_Updates_Isactive`
export const Get_Service_DropDown_By_BusinessID = `${BASE_API_URL}/Project/GetServiceDropDown_ByCountryID`

// ------------------------------
export function getServiceDropDownByBusinessID(BusinessID: number) {
  return axios.post(Get_Service_DropDown_By_BusinessID, {BusinessID})
}
// ------------------------------
export function getProjectList() {
  return axios.get(Get_All_Project_List)
}

export function addProjectDetails(
  businessID: number,
  serviceID: number,
  projectPhotoPath: string,
  projectName: string,
  sortDescription: string,
  description: string,
  broucherPath: string,
  isActive: boolean,
  createBy: number
) {
  return axios.post(Add_Project_Details, {
    businessID,
    serviceID,
    projectPhotoPath,
    projectName,
    sortDescription,
    description,
    broucherPath,
    isActive,
    createBy,
  })
}

export function editProjectDetails(
  projectID: number,
  businessID: number,
  serviceID: number,
  projectName: string,
  projectPhotoPath: string,
  sortDescription: string,
  description: string,
  broucherPath: string,
  isActive: boolean
) {
  return axios.post(Edit_Project_Details, {
    projectID,
    businessID,
    serviceID,
    projectName,
    projectPhotoPath,
    sortDescription,
    description,
    broucherPath,
    isActive,
  })
}
export function deleteProjectDetails(projectID: number) {
  return axios.post(Delete_Project_Details, {projectID})
}
export function getProjectById(projectID: number) {
  return axios.post(Get_Project_By_Id, {projectID})
}
export function getProjectUpdateIsActive(projectID: number, isActive: boolean) {
  return axios.post(project_Update_Isactive, {projectID, isActive})
}
