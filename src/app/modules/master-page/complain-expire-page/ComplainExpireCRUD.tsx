import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL
// =================Agency Type URL=====================
export const Get_Complain_Expire_Web_List = `${BASE_API_URL}/ComplainExpire/GetComplainExpireWebList`
export const Add_Complain_Expire_Details = `${BASE_API_URL}/ComplainExpire/AddComplainExpireDetails`
export const Get_Complain_Expire_By_Complain_Expire_ID = `${BASE_API_URL}/ComplainExpire/GetComplainExpireByComplainExpireID`
export const Update_Complain_Expire_Details = `${BASE_API_URL}/ComplainExpire/UpdateComplainExpireDetails`
export const Post_Delete_Complain_Expire = `${BASE_API_URL}/ComplainExpire/DeleteComplainExpire`

export function getGetComplainExpireWebListAPI() {
  return axios.get(Get_Complain_Expire_Web_List)
}

export function AddComplainExpireDetailsAPI(
    categoryID: number,
    maintenanceDays: number,
    createBy: number,
    ipAddress: string
) {
  return axios.post(Add_Complain_Expire_Details, {
    categoryID,
    maintenanceDays,
    createBy,
    ipAddress,
  })
}

export function GetComplainExpireByComplainExpireIDAPI(complainExpireID: number) {
  return axios.post(Get_Complain_Expire_By_Complain_Expire_ID, {complainExpireID})
}

export function UpdateComplainExpireDetailsAPI(
    complainExpireID: number,
    categoryID: number,
    maintenanceDays: number,
    updateBy: number,
    ipAddress: string
) {
  return axios.post(Update_Complain_Expire_Details, {
    complainExpireID,
    categoryID,
    maintenanceDays,
    updateBy,
    ipAddress,
  })
}

export function deleteComplainExpireAPI(complainExpireID: number) {
  return axios.post(Post_Delete_Complain_Expire, {complainExpireID})
}
