import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL
// =================Emp Education URL=====================
export const Get_All_Career_List = `${BASE_API_URL}/Career/Career_GetList`
export const Get_IsActive_Career_List = `${BASE_API_URL}/Career/Career_GetIsActiveList`
export const Add_Career_Details = `${BASE_API_URL}/Career/Career_AddDetails`
export const Edit_Career_Details = `${BASE_API_URL}/Career/Career_UpdateDetails`
export const Delete_Career_Details = `${BASE_API_URL}/Career/Career_Delete`
export const Get_Career_By_Id = `${BASE_API_URL}/Career/Career_GetByID`
export const Career_Update_Isactive = `${BASE_API_URL}/Career/Career_UpdateIsActive`
export const Get_CareerList_WithCareerReqCount = `${BASE_API_URL}/Career/Career_GetList_WithCareerReqCount`
export const Get_CareerRequest_GetList = `${BASE_API_URL}/CareerRequest/CareerRequest_GetList`
export const Get_CareerRequest_GetListByCareerID = `${BASE_API_URL}/CareerRequest/CareerRequest_GetListByCareerID`
export const delete_CareerRequest_Details = `${BASE_API_URL}/CareerRequest/CareerRequest_Delete`
export const Get_All_Inquiry_List = `${BASE_API_URL}/Career/Inquiry_GetList`
export const delete_Inquiry_Delete_Details = `${BASE_API_URL}/Career/Inquiry_Delete_Dtls?inquiryID=`
// ----------------------------------------

export function getInquiryList() {
  return axios.get(Get_All_Inquiry_List)
}

export function deleteInquiryDtls(inquiryID: number) {
  return axios.post(delete_Inquiry_Delete_Details + inquiryID, {inquiryID})
}
// ------------------------------
export function getCareerRequestListByCareerID(careerID: number) {
  return axios.post(Get_CareerRequest_GetListByCareerID, {careerID})
}

export function getCareerListWithCareerReqCount() {
  return axios.get(Get_CareerList_WithCareerReqCount)
}
export function getCareerRequestList() {
  return axios.get(Get_CareerRequest_GetList)
}
export function getCareerList() {
  return axios.get(Get_All_Career_List)
}
export function getIsActiveCareerList() {
  return axios.get(Get_IsActive_Career_List)
}

export function addCareerDetails(
  businessID: number,
  jobTitle: string,
  skillSet: string,
  description: string,
  experience: string,
  jobLocation: string,
  jobCode: string,
  createBy: number,
  ipAddress: string,
  isActive: boolean
) {
  return axios.post(Add_Career_Details, {
    businessID,
    jobTitle,
    skillSet,
    description,
    experience,
    jobLocation,
    jobCode,
    createBy,
    ipAddress,
    isActive,
  })
}

export function editCareerDetails(
  careerID: number,
  businessID: number,
  jobTitle: string,
  skillSet: string,
  description: string,
  experience: string,
  jobLocation: string,
  jobCode: string,
  updateBy: number,
  ipAddress: string,
  isActive: boolean
) {
  return axios.post(Edit_Career_Details, {
    careerID,
    businessID,
    jobTitle,
    skillSet,
    description,
    experience,
    jobLocation,
    jobCode,
    updateBy,
    ipAddress,
    isActive,
  })
}
export function deleteCareerDetails(careerID: number) {
  return axios.post(Delete_Career_Details, {careerID})
}
export function deleteCareerRequestDtls(careerRequestID: number) {
  return axios.post(delete_CareerRequest_Details, {careerRequestID})
}
export function getCareerById(careerID: number) {
  return axios.post(Get_Career_By_Id, {careerID})
}
export function getCareerUpdateIsActive(careerID: number, isActive: boolean) {
  return axios.post(Career_Update_Isactive, {careerID, isActive})
}
