import axios from 'axios'

const BASE_API_URL = process.env.REACT_APP_API_URL
// =================Album URL=====================
export const GET_Project_Album_List_BY_ID = `${BASE_API_URL}/ProjectAlbum/GetProjectAlbumListByProjectID`
export const GET_Project_Album_BY_Album_ID = `${BASE_API_URL}/ProjectAlbum/GetProjectAlbumByAlbumID`
export const ADD_Project_Album_Dtl = `${BASE_API_URL}/ProjectAlbum/AddProjectAlbumDetails`
export const UPDATE_Project_Album_Dtl = `${BASE_API_URL}/ProjectAlbum/UpdateProjectAlbumDetails`
export const Add_Multi_Name_Project_Album_Photos = `${BASE_API_URL}/ProjectAlbum/AddProjectAlbumPhotosDetails`
export const DELETE_Project_Album_By_ID = `${BASE_API_URL}/ProjectAlbum/PostDeleteProjecAlbum`
export const Delete_Project_Album_Photos_By_ID = `${BASE_API_URL}/ProjectAlbum/PostDeleteProjecAlbumPhotos`
export const GET_Project_Album_Photos_List_BY_Album_ID = `${BASE_API_URL}/ProjectAlbum/GetProjectAlbumPhotosListByProjectAlbumID`

// =====================AlbumPhotos =========
export function deleteProjectAlbumPhotosDtls(projectAlbumDtlID: number) {
  return axios.post(Delete_Project_Album_Photos_By_ID, {
    projectAlbumDtlID,
  })
}
// ======================AlbumPhotos===========
export function getProjectAlbumPhotosListByProjAlbumId(projectAlbumID: number) {
  return axios.post(GET_Project_Album_Photos_List_BY_Album_ID, {
    projectAlbumID,
  })
}
// ===============Album List========================
export function getProjectAlbumListByProjId(projectID: number) {
  return axios.post(GET_Project_Album_List_BY_ID, {
    projectID,
  })
}
export function addMultiNameProjectAlbumPhotosDtlsApi(
  projectAlbumID: number,
  photoTitle: string[],
  photoPath: string[],
  createBy: number,
  ipAddress: string,
) {
  return axios.post(Add_Multi_Name_Project_Album_Photos, {
    projectAlbumID,
    photoTitle,
    photoPath,
    createBy,
    ipAddress
  })
}
export function addProjectAlbumByProjectID(
  projectID: number,
  albumName: string,
  createBy: number,
  ipAddress: string,
) {
  return axios.post(ADD_Project_Album_Dtl, {
    projectID,
    albumName,
    createBy,
    ipAddress,
  })
}


export function getProjectAlbumByAlbumIDApi(projectAlbumID: number) {
  return axios.post(GET_Project_Album_BY_Album_ID, {
    projectAlbumID,
  })
}

export function editProjectAlbumDetails(
  projectID: number,
  projectAlbumID: number,
  albumName: string,
  updateBy: number,
  ipAddress: string
) {
  return axios.post(UPDATE_Project_Album_Dtl, {
    projectID,
    projectAlbumID,
    albumName,
    updateBy,
    ipAddress 
  })
}
export function deleteProjectAlbumByID(projectAlbumID: number) {
  return axios.post(DELETE_Project_Album_By_ID, {
    projectAlbumID,
  })
}
