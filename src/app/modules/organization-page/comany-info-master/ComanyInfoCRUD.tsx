import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL

//=====================Customer URL======================
export const GET_COMPANY_INFO_LIST = `${BASE_API_URL}/CompanyInfo/GetCompanyInfoList`
export const CREATE_COMPANY_DATA = `${BASE_API_URL}/CompanyInfo/AddCompanyInfo`
export const DELETE_COMPANY_INFO = `${BASE_API_URL}/CompanyInfo/DeleteCompanyInfo`
export const GET_COMPANYDATA_BY_COMPANY_ID = `${BASE_API_URL}/CompanyInfo/GetCompanyInfoListById`
export const UPDATE_COMPANY_INFO = `${BASE_API_URL}/CompanyInfo/UpdateCompanyInfo`
export const GET_CUSTOMER_BY_B_ID = `${BASE_API_URL}/Customer/GetCustomerListByBranchID`
// export const UPLOAD_LOHO_IMG = `${BASE_API_URL}/CompanyInfo/UploadLogo`
// export const UPLOAD_SIGN_IMG = `${BASE_API_URL}/CompanyInfo/UploadSignature`

// *************************===========list================*******************************************
export function getCompanyInfoList() {
  return axios.get(GET_COMPANY_INFO_LIST)
}
// *************************===========delete================*******************************************
export function deleteComanyInfo(companyID: number) {
  return axios.post(DELETE_COMPANY_INFO, {companyID})
}
// *************************================BYID===========*******************************************
export function getCompanyInfoListByID(companyID: number) {
  return axios.post(GET_COMPANYDATA_BY_COMPANY_ID, {companyID})
}
// ========================================ADD================================================================
export function createCompanyApi(
  companyName: string,
  addressLine1: string,
  addressLine2: string,
  landmark: string,
  pinCode: string,
  cityName: string,
  stateName: string,
  countryName: string,
  isActive: boolean,
  logoPath: string,
  facebookPath: string,
  instaPath: string,
  youTubePath: string,
  signaturePath: string,
  termsMessage: string,
  thankyouMsg: string,
  gstNumber: string,
  phoneNumber: string,
  mobileNumber: string,
  faxNumer: string,
  stateID: number,
  emailAddress: string,
  gstCode: string,
  currencySymbole: string,
  currencyName: string,
  currencyCode: string
) {
  return axios.post(CREATE_COMPANY_DATA, {
    companyName,
    addressLine1,
    addressLine2,
    landmark,
    pinCode,
    cityName,
    stateName,
    countryName,
    isActive,
    logoPath,
    facebookPath,
    instaPath,
    youTubePath,
    signaturePath,
    termsMessage,
    thankyouMsg,
    gstNumber,
    phoneNumber,
    mobileNumber,
    faxNumer,
    stateID,
    emailAddress,
    gstCode,
    currencySymbole,
    currencyName,
    currencyCode,
  })
}
//==============================================Edit==========================================================
export function UpdateCompanyInfo(
  companyID: number,
  companyName: string,
  addressLine1: string,
  addressLine2: string,
  landmark: string,
  pinCode: string,
  cityName: string,
  stateName: string,
  countryName: string,
  isActive: boolean,
  logoPath: string,
  facebookPath: string,
  instaPath: string,
  youTubePath: string,
  signaturePath: string,
  termsMessage: string,
  thankyouMsg: string,
  gstNumber: string,
  phoneNumber: string,
  mobileNumber: string,
  faxNumer: string,
  stateID: number,
  emailAddress: string,
  gstCode: string,
  currencySymbole: string,
  currencyName: string,
  currencyCode: string
) {
  return axios.post(UPDATE_COMPANY_INFO, {
    companyID,
    companyName,
    addressLine1,
    addressLine2,
    landmark,
    pinCode,
    cityName,
    stateName,
    countryName,
    isActive,
    logoPath,
    facebookPath,
    instaPath,
    youTubePath,
    signaturePath,
    termsMessage,
    thankyouMsg,
    gstNumber,
    phoneNumber,
    mobileNumber,
    faxNumer,
    stateID,
    emailAddress,
    gstCode,
    currencySymbole,
    currencyName,
    currencyCode,
  })
}
