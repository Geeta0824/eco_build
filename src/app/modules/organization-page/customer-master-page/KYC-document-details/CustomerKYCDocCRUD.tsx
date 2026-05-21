import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL
//=====================CustomerKYCDocument URL======================
export const GET_ALL_CUSTOMER_KYC_DOCUMENT = `${BASE_API_URL}/CustomerKYCDocument/GetCustomerKYCDocumentList`
export const CREATE_CUSTOMER_KYC_DOCUMENT = `${BASE_API_URL}/CustomerKYCDocument/AddCustomerKYCDocumentDetails`
export const GET_CUSTOMER_KYC_DOCUMENT_BY_EMP_MAP_ID = `${BASE_API_URL}/CustomerKYCDocument/GetCustomerKYCDocumentByCustomerKYCDocIMapD`
export const UPDATE_CUSTOMER_KYC_DOCUMENT = `${BASE_API_URL}/CustomerKYCDocument/UpdateCustomerKYCDocumentDetails`
export const ISACTIVE_CUSTOMER_KYC_DOCUMENT = `${BASE_API_URL}/CustomerKYCDocument/UpdateCustomerKYCDocumentIsactive`
export const DELETE_CUSTOMER_KYC_DOCUMENT = `${BASE_API_URL}/CustomerKYCDocument/DeleteCustomerKYCDocument`
export const GET_CUSTOMER_KYC_DOCUMENT = `${BASE_API_URL}/CustomerKYCDocument/GetCustomerKYCDocumentByCustomerID`
// export const SAVE_KYC_PHOTO = `${BASE_API_URL}/CustomerKYCDocument/SaveKycPhoto/`

// export function saveCustomerKycPhoto(customerID: number, formData: any) {
//   return axios.post(SAVE_KYC_PHOTO + customerID, {formData})
// }

export function getAllCustomerKYCDocument() {
  return axios.get(GET_ALL_CUSTOMER_KYC_DOCUMENT)
}

export function getCustomerKYCDocument(customerID: number) {
  return axios.post(GET_CUSTOMER_KYC_DOCUMENT, {customerID})
}

export function createCustomerKYCDocument(
  customerID: number,
  kycDocID: number,
  documentNumber: string,
  filePath: string,
  isActive: boolean,
  createBy: number,
  ipAddress: string
) {
  return axios.post(CREATE_CUSTOMER_KYC_DOCUMENT, {
    customerID,
    kycDocID,
    documentNumber,
    filePath,
    isActive,
    createBy,
    ipAddress,
  })
}
export function getCustomerKYCDocumentByCustomerKYCDocumentId(customerkycDocIMapD: string) {
  return axios.post(GET_CUSTOMER_KYC_DOCUMENT_BY_EMP_MAP_ID, {customerkycDocIMapD})
}
export function updateCustomerKYCDocument(
  customerkycDocIMapD: number,
  customerID: number,
  kycDocID: number,
  documentNumber: string,
  filePath: string,
  isActive: boolean,
  updateBy: number,
  ipAddress: string
) {
  return axios.post(UPDATE_CUSTOMER_KYC_DOCUMENT, {
    customerkycDocIMapD,
    customerID,
    kycDocID,
    documentNumber,
    filePath,
    isActive,
    updateBy,
    ipAddress,
  })
}
export function isActiveCustomerKYCDocument(customerkycDocIMapD: number, isActive: boolean) {
  return axios.post(ISACTIVE_CUSTOMER_KYC_DOCUMENT, {customerkycDocIMapD, isActive})
}
export function deleteCustomerKYCDocument(customerkycDocIMapD: number) {
  return axios.post(DELETE_CUSTOMER_KYC_DOCUMENT, {customerkycDocIMapD})
}
