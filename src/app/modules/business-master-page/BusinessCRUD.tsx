import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL
// =================Emp Education URL=====================
export const Get_All_Business_List = `${BASE_API_URL}/Business/Business_GetList`
export const Add_Business_Details = `${BASE_API_URL}/Business/Business_AddDetails`
export const Edit_Business_Details = `${BASE_API_URL}/Business/Business_UpdateDetails`
export const Delete_Business_Details = `${BASE_API_URL}/Business/Business_Delete_Details`
export const Get_Business_By_Id = `${BASE_API_URL}/Business/Business_GetBy_BusinessID`
export const Business_Update_Isactive = `${BASE_API_URL}/Business/Business_Updates_Isactive`

// ------------------------------
export function getBusinessList() {
  return axios.get(Get_All_Business_List)
}

export function addBusinessDetails(
  businessName: string,
  businessLogoFilePath: string,
  businessPhotoPath: string,
  sortDescription: string,
  description: string,
  businessStartDate: string,
  businessContactNo: string,
  businessEmailID: string,
  businessAddress1: string,
  businessAddress2: string,
  businessCity: string,
  businessState: string,
  broucherPath: string,
  isActive: boolean,
  createBy: number
) {
  return axios.post(Add_Business_Details, {
    businessName,
    businessLogoFilePath,
    businessPhotoPath,
    sortDescription,
    description,
    businessStartDate,
    businessContactNo,
    businessEmailID,
    businessAddress1,
    businessAddress2,
    businessCity,
    businessState,
    broucherPath,
    isActive,
    createBy,
  })
}

export function editBusinessDetails(
  businessID: number,
  businessName: string,
  businessLogoFilePath: string,
  businessPhotoPath: string,
  sortDescription: string,
  description: string,
  businessStartDate: string,
  businessContactNo: string,
  businessEmailID: string,
  businessAddress1: string,
  businessAddress2: string,
  businessCity: string,
  businessState: string,
  broucherPath: string,
  isActive: boolean
) {
  return axios.post(Edit_Business_Details, {
    businessID,
    businessName,
    businessLogoFilePath,
    businessPhotoPath,
    sortDescription,
    description,
    businessStartDate,
    businessContactNo,
    businessEmailID,
    businessAddress1,
    businessAddress2,
    businessCity,
    businessState,
    broucherPath,
    isActive,
  })
}
export function deleteBusinessDetails(businessID: number) {
  return axios.post(Delete_Business_Details, {businessID})
}
export function getBusinessById(businessID: number) {
  return axios.post(Get_Business_By_Id, {businessID})
}
export function getBusinessUpdateIsActive(businessID: number, isActive: boolean) {
  return axios.post(Business_Update_Isactive, {businessID, isActive})
}
