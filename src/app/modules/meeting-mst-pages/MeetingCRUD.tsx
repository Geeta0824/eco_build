import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL
// =================Emp Education URL=====================
export const Get_Meeting_List = `${BASE_API_URL}/Meeting/GetMeetingList`
export const Get_Meeting_List_By_Employee = `${BASE_API_URL}/Meeting/GetMeetingListByEmployee`
export const Add_Meeting_Details = `${BASE_API_URL}/Meeting/AddMeetingDetails`
export const Get_Employee_Map_List_With_Project = `${BASE_API_URL}/Project/GetEmployeeMapListWithProject`
export const Get_Meeting_Type_List = `${BASE_API_URL}/Meeting/GetMeetingTypeList`
export const Update_Meeting_Details = `${BASE_API_URL}/Meeting/UpdateMeetingDetails`
export const Update_Meeting_Close_Details = `${BASE_API_URL}/Meeting/UpdateMeeting_Close_Details`
export const Get_Meeting_By_ID = `${BASE_API_URL}/Meeting/GetMeetingsByID`
export const Get_Meeting_Status_List = `${BASE_API_URL}/Meeting/GetMeetingStatusList`
export const Get_Meeting_Medium_List = `${BASE_API_URL}/Meeting/GetMeetingMediumList`
export const Get_Meeting_Venue_List = `${BASE_API_URL}/Meeting/GetMeetingVenueList`
export const Get_Vendor_Map_List_With_Project = `${BASE_API_URL}/Project/GetVendorMapListWithProject`
export const Update_Meeting_IsJoin = `${BASE_API_URL}/Meeting/UpdateMeeting_IsJoin`

export function GetMeetingListApi() {
  return axios.get(Get_Meeting_List)
}
export function GetMeetingListByEmployeeApi(
  employeeID: number,
  roleID: number,
  designationID: number
) {
  return axios.post(Get_Meeting_List_By_Employee, {employeeID, roleID, designationID})
}
// =======================================Add===================================
export function AddMeetingDetailsApi(
  projectID: number,
  isClient: boolean,
  isAgency: boolean,
  vendorID: number,
  description: string,
  meetingDate: string,
  startTime: string,
  endTime: string,
  venueID: number,
  meetingBy: number,
  statusID: number,
  mediumID: number,
  meetingTypeID: number,
  employeeIDs: string
) {
  return axios.post(Add_Meeting_Details, {
    projectID,
    isClient,
    isAgency,
    vendorID,
    description,
    meetingDate,
    startTime,
    endTime,
    venueID,
    meetingBy,
    statusID,
    mediumID,
    meetingTypeID,
    employeeIDs,
  })
}
// =================================Update=========================================
export function UpdateMeetingDetails(
  projectID: number,
  isClient: boolean,
  isAgency: boolean,
  vendorID: number,
  description: string,
  meetingDate: string,
  startTime: string,
  endTime: string,
  venueID: number,
  meetingBy: number,
  statusID: number,
  mediumID: number,
  meetingTypeID: number,
  employeeIDs: string,
  meetingID: number
) {
  return axios.post(Update_Meeting_Details, {
    projectID,
    isClient,
    isAgency,
    vendorID,
    description,
    meetingDate,
    startTime,
    endTime,
    venueID,
    meetingBy,
    statusID,
    mediumID,
    meetingTypeID,
    employeeIDs,
    meetingID,
  })
}

// =========================================================================================
export function GetEmployeeMapListWithProject(projectID: number) {
  return axios.post(Get_Employee_Map_List_With_Project, {projectID})
}

// ===========================================================================================
export function GetMeetingTypeList() {
  return axios.get(Get_Meeting_Type_List)
}
export function GetMeetingStatusList() {
  return axios.get(Get_Meeting_Status_List)
}
export function GetMeetingMediumList() {
  return axios.get(Get_Meeting_Medium_List)
}
export function GetMeetingVenueList() {
  return axios.get(Get_Meeting_Venue_List)
}
export function GetVendorMapListWithProject(projectID: number) {
  return axios.post(Get_Vendor_Map_List_With_Project, {projectID})
}
// ===========================================================================================
export function UpdateMeetingCloseDetails(
  meetingID: number,
  statusID: number,
  meetingEndDate: string,
  meetingEndTime: string,
  conclusion: string
) {
  return axios.post(Update_Meeting_Close_Details, {
    meetingID,
    statusID,
    meetingEndDate,
    meetingEndTime,
    conclusion,
  })
}

// ===========================================================================================
export function GetMeetingByMeetingID(meetingID: number) {
  return axios.post(Get_Meeting_By_ID, {meetingID})
}
// ==========================================================================
export function UpdateMeeting_IsJoinApi(meetingID: number,employeeID:number) {
  return axios.post(Update_Meeting_IsJoin, {meetingID,employeeID})
}
