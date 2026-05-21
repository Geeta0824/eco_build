import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL
//=====================DNC Remarks URL======================

export const GET_ALL_New_Vendor_Registation_List = `${BASE_API_URL}/Vendor/GetNewVendorRegistationListUsingWebAndMobile` //Get Vendor Registation Page
export const GET_View_New_Vendor_Registration_By_Vendor_ID = `${BASE_API_URL}/Vendor/ViewNewVendorRegistrationByVendorID` //Update Vendor Registation Page

// ========= GET DNC Remarks =================================
export function getAllNewVendorRegistationListApi() {
  return axios.get(GET_ALL_New_Vendor_Registation_List)
}

// ---------------------- Get By ID For View ------------------
export function getViewNewVendorRegistrationByVendorID(vendorID: number) {
  return axios.post(GET_View_New_Vendor_Registration_By_Vendor_ID, {
    vendorID,
  })
}
