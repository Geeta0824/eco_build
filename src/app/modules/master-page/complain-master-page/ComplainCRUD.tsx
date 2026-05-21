import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL
// =================Agency Type URL=====================
export const Get_Complain_Web_List = `${BASE_API_URL}/Complain/GetComplainWebList`
export const Add_Complain_Details = `${BASE_API_URL}/Complain/AddComplainDetails`
export const Get_Complain_By_ComplainID = `${BASE_API_URL}/Complain/GetComplainByComplainID`
export const Update_Complain_Details = `${BASE_API_URL}/Complain/UpdateComplainDetails`
export const Post_Delete_Complain = `${BASE_API_URL}/Complain/PostDeleteComplain`

export function getGetComplainWebListAPI() {
  return axios.get(Get_Complain_Web_List)
}

export function AddComplainDetailsAPI(
  projectTypeID: number,
  agencyTypeID: number,
  complainDescription: string
) {
  return axios.post(Add_Complain_Details, {
    projectTypeID,
    agencyTypeID,
    complainDescription,
  })
}

export function GetComplainByComplainIDAPI(complainID: number) {
  return axios.post(Get_Complain_By_ComplainID, {complainID})
}

export function UpdateComplainDetailsAPI(
  complainID: number,
  projectTypeID: number,
  agencyTypeID: number,
  complainDescription: string
) {
  return axios.post(Update_Complain_Details, {
    complainID,
    projectTypeID,
    agencyTypeID,
    complainDescription,
  })
}

export function deleteComplainAPI(complainID: number) {
  return axios.post(Post_Delete_Complain, {complainID})
}
