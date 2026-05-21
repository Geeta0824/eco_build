import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL
// =================Customer Complain URL=====================
export const Get_Customer_Complain_List = `${BASE_API_URL}/CustomerComplain/GetCustomerComplainList`
export const Create_Customer_Complain = `${BASE_API_URL}/CustomerComplain/CustomerComplainReqByCompany`
export const Get_Complain_Description_list = `${BASE_API_URL}/CustomerComplain/GetComplainDescriptionList`
export const Get_Customer_List_For_Complain_Req = `${BASE_API_URL}/CustomerComplain/GetCustomerListForComplainReq`
export const View_Customer_Complain_StatusPMC = `${BASE_API_URL}/CustomerComplain/ViewCustomerComplainStatusPMC`
export const Get_Complain_List_AndPhotos_By_CustomerComplainMainID = `${BASE_API_URL}/CustomerComplain/GetComplainListAndPhotosByCustomerComplainMainID`
export const Get_Complain_Photo_OfWork = `${BASE_API_URL}/CustomerComplain/GetComplainPhotoOfWork`
export const Close_Complain_ComplainByPMC = `${BASE_API_URL}/CustomerComplain/CloseCustomerComplainByPMC`

// =========================Get list=====================

export function getCustomerComplainByPMCApi(customerComplainMainID:number) {
  return axios.post(Close_Complain_ComplainByPMC,{customerComplainMainID})
}
// =========================Get list=====================

export function getCustomerComplainListApi() {
  return axios.get(Get_Customer_Complain_List)
}
// =========================customer list=====================

export function GetCustomerListForComplainReq() {
  return axios.get(Get_Customer_List_For_Complain_Req)
}

// =========================Add Copmlain=====================
export function CreateCustomerComplainReq(
  customerID: number,
  projectID: number,
  agencyTypeID: number,
  complainDescription: string,
  complainIDs: string,
  photoPath: string,
  createBy: number,
  ipAddress: string
) {
  return axios.post(Create_Customer_Complain, {
    customerID,
    createBy,
    projectID,
    agencyTypeID,
    complainDescription,
    ipAddress,
    complainIDs,
    photoPath,
  })
}
// ========================= CopmlainDescription=====================

export function GetComplainDescriptionlist(agencyTypeID: number) {
  return axios.post(Get_Complain_Description_list, {agencyTypeID})
}

export function ViewCustomerComplainStatusPMCAPI(customerComplainMainID: number) {
  return axios.post(View_Customer_Complain_StatusPMC, {customerComplainMainID})
}
export function GetComplainListAndPhotosByCustomerComplainMainIDAPI(
  customerComplainMainID: number
) {
  return axios.post(Get_Complain_List_AndPhotos_By_CustomerComplainMainID, {customerComplainMainID})
}

export function GetComplainPhotoOfWorkAPI(
  customerComplainMainID: number,
  customerComplainID: number,
  photoTypeID: number
) {
  return axios.post(Get_Complain_Photo_OfWork, {
    customerComplainMainID,
    customerComplainID,
    photoTypeID,
  })
}
