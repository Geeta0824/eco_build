import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL
// =================Emp Education URL=====================
export const Get_All_Service_List = `${BASE_API_URL}/Service/Service_GetList`
export const Add_Service_Details = `${BASE_API_URL}/Service/Service_AddDetails`
export const Edit_Service_Details = `${BASE_API_URL}/Service/Service_UpdateDetails`
export const Delete_Service_Details = `${BASE_API_URL}/Service/Service_Delete_Details`
export const Get_Service_By_Id = `${BASE_API_URL}/Service/Service_GetBy_ServiceID`
export const Service_Update_Isactive = `${BASE_API_URL}/Service/Service_Updates_Isactive`

// ------------------------------
export function getServiceList() {
  return axios.get(Get_All_Service_List)
}

export function addServiceDetails(
  businessID: number,
  serviceName: string,
  servicePhotoPath: string,
  sortDescription: string,
  description: string,
  broucherPath: string,
  isActive: boolean,
  createBy: number
) {
  return axios.post(Add_Service_Details, {
    businessID,
    serviceName,
    servicePhotoPath,
    sortDescription,
    description,
    broucherPath,
    isActive,
    createBy,
  })
}

export function editServiceDetails(
  businessID: number,
  serviceID: number,
  serviceName: string,
  servicePhotoPath: string,
  sortDescription: string,
  description: string,
  broucherPath: string,
  isActive: boolean
) {
  return axios.post(Edit_Service_Details, {
    businessID,
    serviceID,
    serviceName,
    servicePhotoPath,
    sortDescription,
    description,
    broucherPath,
    isActive,
  })
}
export function deleteServiceDetails(serviceID: number) {
  return axios.post(Delete_Service_Details, {serviceID})
}
export function getServiceById(serviceID: number) {
  return axios.post(Get_Service_By_Id, {serviceID})
}
export function getServiceUpdateIsActive(serviceID: number, isActive: boolean) {
  return axios.post(Service_Update_Isactive, {serviceID, isActive})
}
