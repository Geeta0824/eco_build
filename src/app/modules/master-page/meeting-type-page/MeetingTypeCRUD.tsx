import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL
// =================Kyc Document URL=====================
export const Get_Meeting_Type_List = `${BASE_API_URL}/Meeting/GetMeetingTypeList`
export const Add_Meeting_Type_List = `${BASE_API_URL}/MeetingMaster/AddMeetingType`
export const Update_Meeting_Type = `${BASE_API_URL}/MeetingMaster/UpdateMeetingType`
export const Delete_Meeting_Type = `${BASE_API_URL}/MeetingMaster/DeleteMeetingType`
export const Get_Meeting_Type_By_MeetingTypeID = `${BASE_API_URL}/MeetingMaster/GetMeetingTypeByMeetingTypeID`

// =======================================================
export function GetMeetingTypeList() {
  return axios.get(Get_Meeting_Type_List)
}
export function AddMeetingTypeApi(meetingTypeName: string) {
  return axios.post(Add_Meeting_Type_List, {meetingTypeName})
}
export function UpdateMeetingTypeApi(meetingTypeID: number, meetingTypeName: string) {
  return axios.post(Update_Meeting_Type, {meetingTypeID, meetingTypeName})
}
export function DeleteMeetingType(meetingTypeID: number) {
  return axios.post(Delete_Meeting_Type, {meetingTypeID})
}
export function GetMeetingTypeByMeetingTypeID(meetingTypeID: number) {
  return axios.post(Get_Meeting_Type_By_MeetingTypeID, {meetingTypeID})
}
