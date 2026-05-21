import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL
export const GET_VENDOR_WEB_LIST = `${BASE_API_URL}/Vendor/GetVendorWebList` //Get Designation
export const ADD_VENDOR_DETAILS = `${BASE_API_URL}/Vendor/AddVendorDetails` //Get Designation
export const UPDATE_VENDOR_DETAILS = `${BASE_API_URL}/Vendor/UpdateVendorDetails` //Get Designation
export const DELETE_VENDOR_DETAILS = `${BASE_API_URL}/Vendor/PostDeleteVendor` //Get Designation
export const GET_VENDOR_BY_VENDOR_ID = `${BASE_API_URL}/Vendor/GetVendorByVendorID` //Get Designation
export const UPDATE_VENDOR_ISACTIVE = `${BASE_API_URL}/Vendor/UpdateVendorIsactive` //Get Designation
export const Get_Vendor_List_By_VendorTypeID = `${BASE_API_URL}/Vendor/GetVendorListByTypeID` //Get Designation
export const Get_Agency_Type_With_VendorTypeID = `${BASE_API_URL}/AgencyType/GetAgencyTypeWithVendorID` //Get Agency  Type
export const Add_Agency_Type_By_VendorTypeID = `${BASE_API_URL}/AgencyType/AddAgencyTypeByVendorID` //Get Agency  Type
export const Add_Vendor_Details_ByAdmin = `${BASE_API_URL}/Vendor/AddVendorDetailsByAdmin` //Get Agency  Type
export const GET_Vendor_View_By_ID = `${BASE_API_URL}/Vendor/ViewVendorByVendorID` //Vendor By Id
export const GET_Agency_Get_List_By_Vendor_ID = `${BASE_API_URL}/Agency/GetAgency_GetList_By_VendorID` //Vendor By Id
export const GET_Project_List_By_Agency_ID_Open = `${BASE_API_URL}/Agency/GetProjectList_By_AgencyID_Open` //Vendor By Id
export const GET_Project_List_By_Agency_ID_Close = `${BASE_API_URL}/Agency/GetProjectList_By_AgencyID_Close` //Vendor By Id
export const GET_VENDOR_WEB_ACTIVE_LIST = `${BASE_API_URL}/Vendor/GetVendor_Active_WebList` //Get Designation
export const VENDOR_CHANGE_PASSWORD = `${BASE_API_URL}/Vendor/VendorChangePassword` //Get Designation
// ======================Get Designation=============================
export function getProjectListByAgencyIdCloseApi(agencyID: number) {
  return axios.post(GET_Project_List_By_Agency_ID_Close, {agencyID})
}
export function getProjectListByAgencyIdOpenApi(agencyID: number) {
  return axios.post(GET_Project_List_By_Agency_ID_Open, {agencyID})
}
export function getAgencyGetListByVendorIDApi(vendorID: number) {
  return axios.post(GET_Agency_Get_List_By_Vendor_ID, {vendorID})
}
export function getVenderViewDataApi(vendorID: number) {
  return axios.post(GET_Vendor_View_By_ID, {vendorID})
}
export function getVenderWebList() {
  return axios.get(GET_VENDOR_WEB_LIST)
}

export function getVenderWebList_Active() {
  return axios.get(GET_VENDOR_WEB_ACTIVE_LIST)
}

export function addVenderDetails(
  vendorTypeID: number,
  companyName: string,
  email: string,
  contactNumber: string,
  contactPerson: string,
  gstNumber: string,
  pancardNumber: string,
  aboutVendor: string,
  address: string,
  isActive: boolean,
  createBy: number,
  ipAddress: string
) {
  return axios.post(Add_Vendor_Details_ByAdmin, {
    vendorTypeID,
    companyName,
    email,
    contactNumber,
    contactPerson,
    gstNumber,
    pancardNumber,
    aboutVendor,
    address,
    isActive,
    createBy,
    ipAddress,
  })
}

export function updateVendorDetails(
  vendorID: number,
  vendorTypeID: number,
  companyName: string,
  email: string,
  contactPerson: string,
  gstNumber: string,
  pancardNumber: string,
  aboutVendor: string,
  contactNumber: string,
  address: string,
  isActive: boolean,
  updateBy: number,
  ipAddress: string
) {
  return axios.post(UPDATE_VENDOR_DETAILS, {
    vendorID,
    vendorTypeID,
    companyName,
    email,
    contactPerson,
    gstNumber,
    pancardNumber,
    aboutVendor,
    contactNumber,
    address,
    isActive,
    updateBy,
    ipAddress,
  })
}

export function deleteVenderDetails(vendorID: number) {
  return axios.post(DELETE_VENDOR_DETAILS, {
    vendorID,
  })
}

export function getVendorByVendorID(vendorID: number) {
  return axios.post(GET_VENDOR_BY_VENDOR_ID, {
    vendorID,
  })
}

export function updateVendorIsactive(vendorID: number, isActive: boolean) {
  return axios.post(UPDATE_VENDOR_ISACTIVE, {
    vendorID,
    isActive,
  })
}
// ======================Get Vendor By VendorTypeID=============================
export function getVenderListByVendorTypeID(vendorTypeID: number) {
  return axios.post(Get_Vendor_List_By_VendorTypeID, {vendorTypeID})
}
//===================== agency Type ============================================

export function getAgencyTypeWithVendorTypeID(vendorID: number) {
  return axios.post(Get_Agency_Type_With_VendorTypeID, {vendorID})
}
export function addAgencyTypeByVendorTypeID(agencyTypeID: string, vendorID: number) {
  return axios.post(Add_Agency_Type_By_VendorTypeID, {agencyTypeID, vendorID})
}

export function vendorChangePassword(vendorID: number, OldPwd: string, NewPwd: string) {
  return axios.post(VENDOR_CHANGE_PASSWORD, {vendorID, OldPwd, NewPwd})
}
