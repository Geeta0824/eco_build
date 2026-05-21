import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL
// =================Change Password=====================
// export const Add_Project_Fund_Recive = `${BASE_API_URL}/Fund/AddProjectFundReceive`
export const GetSundryCreditorsList_VendorWise = `${BASE_API_URL}/ProjectStatus/GetSundryCreditorsList_VendorWise`
export const ExportExcelSundryCreditors_VendorGroup_Excel = `${BASE_API_URL}/ProjectStatus/ExportExcelSundryCreditors_VendorGroup_Excel`
export const GetSundryCreditorsList_ByVendorID = `${BASE_API_URL}/ProjectStatus/GetSundryCreditorsList_ByVendorID`
export const ExportExcelSundryCreditors_Excel_ByVendorID = `${BASE_API_URL}/ProjectStatus/ExportExcelSundryCreditors_Excel_ByVendorID`

export function getSundryCreditorsListApi() {
  return axios.get(GetSundryCreditorsList_VendorWise)
}

export function ExportExcelSundryCreditorsListApi() {
  return axios.get(ExportExcelSundryCreditors_VendorGroup_Excel)
}

export function getSundryCreditorsListByVendorIDApi(vendorID: number) {
  return axios.post(GetSundryCreditorsList_ByVendorID, {vendorID})
}

export function ExportExcelSundryCreditorsListByVendorIDApi(vendorID: number) {
  return axios.post(ExportExcelSundryCreditors_Excel_ByVendorID, {vendorID})
}
