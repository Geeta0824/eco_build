import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL
// =================Department URL=====================
export const GET_ALL_Additional_Item_List = `${BASE_API_URL}/ProjectAdditionalItem/GetProjectAdditionalItemListByProjectID`
export const Add_Additional_Item_Details = `${BASE_API_URL}/ProjectAdditionalItem/AddProjectAdditionalItemDetails`
export const Edit_Additional_Item_Details = `${BASE_API_URL}/ProjectAdditionalItem/UpdateProjectAdditionalItemDetails`
export const GET_Additional_Item_By_Additional_Item_ID = `${BASE_API_URL}/ProjectAdditionalItem/GetProjectAdditionalItemByProAddItemID`
export const Delete_Additional_Item_Data = `${BASE_API_URL}/ProjectAdditionalItem/DeleteProjectAdditionalItem`

// =========================Get ProjectStatus_List=====================
export function getAllAdditionalItemListAPI(projectID: number) {
  return axios.post(GET_ALL_Additional_Item_List, {projectID})
}

export function AddAdditionalItemDetailsAPI(
  projectID: number,
  additionalItemDescription: string,
  additionalAmount: number,
  createDate: string,
  createBy: number,
  ipAddress: string
) {
  return axios.post(Add_Additional_Item_Details, {
    projectID,
    additionalItemDescription,
    additionalAmount,
    createDate,
    createBy,
    ipAddress,
  })
}
export function getAdditionalItemByAdditionalItemIdAPI(projectAdditionalItemID: number) {
  return axios.post(GET_Additional_Item_By_Additional_Item_ID, {projectAdditionalItemID})
}
export function EditAdditionalItemDetailsAPI(
  projectID: number,
  projectAdditionalItemID: number,
  additionalItemDescription: string,
  additionalAmount: number,
  createDate: string,
  updateBy: number,
  ipAddress: string
) {
  return axios.post(Edit_Additional_Item_Details, {
    projectID,
    projectAdditionalItemID,
    additionalItemDescription,
    additionalAmount,
    createDate,
    updateBy,
    ipAddress,
  })
}
export function DeleteAdditionalItemDataAPI(projectAdditionalItemID: number) {
  return axios.post(Delete_Additional_Item_Data, {projectAdditionalItemID})
}
