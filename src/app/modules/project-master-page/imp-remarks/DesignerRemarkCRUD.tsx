import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL
// =================Department URL=====================
export const GetProjectDesignerRemarkList = `${BASE_API_URL}/ProjectDesignerRemark/GetProjectDesignerRemarkList`
export const AddProjectDesignerRemarkDetails = `${BASE_API_URL}/ProjectDesignerRemark/AddProjectDesignerRemarkDetails`
export const UpdateProjectDesignerRemarkDetails = `${BASE_API_URL}/ProjectDesignerRemark/UpdateProjectDesignerRemarkDetails`
export const DeleteProjectDesignerRemark = `${BASE_API_URL}/ProjectDesignerRemark/DeleteProjectDesignerRemark`

// =========================Get ProjectStatus_List=====================

export function GetProjectDesignerRemarkListListAPI(projectID: number) {
  return axios.post(GetProjectDesignerRemarkList, {projectID})
}

export function AddProjectDesignerRemarkDetailsAPI(
  projectDesignerRemark: string,
  projectID: number,
  createBy: number,
  ipAddress: string
) {
  return axios.post(AddProjectDesignerRemarkDetails, {
    projectDesignerRemark,
    projectID,
    createBy,
    ipAddress,
  })
}

export function UpdateProjectDesignerRemarkDetailsAPI(
  projectDesignerRemarkID: number,
  projectDesignerRemark: string,
  projectID: number,
  updateBy: number,
  ipAddress: string
) {
  return axios.post(UpdateProjectDesignerRemarkDetails, {
    projectDesignerRemarkID,
    projectDesignerRemark,
    projectID,
    updateBy,
    ipAddress,
  })
}

export function DeleteProjectDesignerRemarkAPI(projectDesignerRemarkID: number) {
  return axios.post(DeleteProjectDesignerRemark, {projectDesignerRemarkID})
}
