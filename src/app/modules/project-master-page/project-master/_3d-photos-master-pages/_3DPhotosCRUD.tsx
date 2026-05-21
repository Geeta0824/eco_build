import axios from 'axios'

const BASE_API_URL = process.env.REACT_APP_API_URL
// =================Department URL=====================
export const GET_Project_Image_Structure_List = `${BASE_API_URL}/ProjectImage/GetProjectImageListByProjectID`
export const GET_Project_Image_Structure_BY_ID = `${BASE_API_URL}/ProjectImage/GetProjectImageByProjectImageID`
export const ADD_Project_Image_Structure_By_Project_ID = `${BASE_API_URL}/ProjectImage/AddProjectImageDetails`
export const ADD_Multi_Project_Image_Structure_By_Project_ID = `${BASE_API_URL}/ProjectImage/Add_Multi_Name_ProjectImageDetails`
export const UPDATE_Project_Image_Structure_By_Project_ID = `${BASE_API_URL}/ProjectImage/UpdateProjectImageDetails`
export const DELETE_Project_Image_Structure_By_ID = `${BASE_API_URL}/ProjectImage/DeleteProjectImageItem`

export function getProjectProject3dImageList(projectID: number) {
  return axios.post(GET_Project_Image_Structure_List, {
    projectID,
  })
}

export function addProjectProject3dImageByProjectID(
  projectID: number,
  photoTitle: string,
  photoPath: string,
  createBy: number
) {
  return axios.post(ADD_Project_Image_Structure_By_Project_ID, {
    projectID,
    photoTitle,
    photoPath,
    createBy,
  })
}

export function Add_Multi_Name_ProjectImageDetailsApi(
  projectID: number,
  photoTitle: string[],
  photoPath: string[],
  createBy: number
) {
  return axios.post(ADD_Multi_Project_Image_Structure_By_Project_ID, {
    projectID,
    photoTitle,
    photoPath,
    createBy,
  })
}
export function GetProjectProject3dImageByImageByID(projectImageID: number) {
  return axios.post(GET_Project_Image_Structure_BY_ID, {
    projectImageID,
  })
}

export function updateProjectProject3dImageByProjectID(
  projectID: number,
  projectImageID: number,
  photoTitle: string,
  photoPath: string,
  updateBy: number
) {
  return axios.post(UPDATE_Project_Image_Structure_By_Project_ID, {
    projectID,
    projectImageID,
    photoTitle,
    photoPath,
    updateBy,
  })
}
export function deleteProjectProject3dImageByID(projectImageID: number) {
  return axios.post(DELETE_Project_Image_Structure_By_ID, {
    projectImageID,
  })
}
