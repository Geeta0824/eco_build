import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL
// =================Agency Type URL=====================
export const Get_Complain_Expire_Web_List = `${BASE_API_URL}/ComplainExpire_New/GetComplainExpireWebList`
export const Add_Complain_Expire_Details = `${BASE_API_URL}/ComplainExpire_New/AddComplainExpireDetails`
export const Get_Complain_Expire_By_Complain_Expire_ID = `${BASE_API_URL}/ComplainExpire_New/GetComplainExpireByComplainExpireID`
export const Update_Complain_Expire_Details = `${BASE_API_URL}/ComplainExpire_New/UpdateComplainExpireDetails`
export const Post_Delete_Complain_Expire = `${BASE_API_URL}/ComplainExpire_New/DeleteComplainExpire`

export function getGetComplainExpireWebListAPI() {
  return axios.get(Get_Complain_Expire_Web_List)
}

export function AddComplainExpireDetailsAPI(encodedReq: string) {
  return axios.post(Add_Complain_Expire_Details, {encodedReq})
}

export function GetComplainExpireByComplainExpireIDAPI(encodedReq: string) {
  return axios.post(Get_Complain_Expire_By_Complain_Expire_ID, {encodedReq})
}

export function UpdateComplainExpireDetailsAPI(encodedReq: string) {
  return axios.post(Update_Complain_Expire_Details, {
    encodedReq,
  })
}

export function deleteComplainExpireAPI(encodedReq: string) {
  return axios.post(Post_Delete_Complain_Expire, {encodedReq})
}
