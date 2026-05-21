import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL
// =================Kyc Document URL=====================
export const GET_ALL_KYC_DOCUMENT = `${BASE_API_URL}/KYCDocument/GetKYCDocumentList`
export const CREATE_KYC_DOCUMENT = `${BASE_API_URL}/KYCDocument/AddKYCDocumentDetails`
export const UPDATE_KYC_DOCUMENT = `${BASE_API_URL}/KYCDocument/UpdateKYCDocumentDetails`
export const GET_ALL_KYC_DOCUMENT_BY_KYC_DOCUMENT_ID = `${BASE_API_URL}/KYCDocument/GetKYCDocumentByKYCDocID`
export const DELETE_KYC_DOCUMENT = `${BASE_API_URL}/KYCDocument/DeleteKYCDocument`
export const ISACTIVE_KYC_DOCUMENT = `${BASE_API_URL}/KYCDocument/UpdateKYCDocumentIsactive`

export function getAllKycDocument() {
  return axios.get(GET_ALL_KYC_DOCUMENT)
}
export function deleteKycDocument(kycDocID: number) {
  return axios.post(DELETE_KYC_DOCUMENT, {kycDocID})
}
export function isActiveKycDocument(kycDocID: number, isActive: boolean) {
  return axios.post(ISACTIVE_KYC_DOCUMENT, {kycDocID, isActive})
}
export function createKycDocument(documentName: string, isActive: boolean, createBy: number,ipAddress:string) {
  return axios.post(CREATE_KYC_DOCUMENT, {documentName, isActive, createBy,ipAddress})
}
export function updateKycDocument(
  kycDocID: number,
  documentName: string,
  isActive: boolean,
  updateyBy: number,
  ipAddress:string
) {
  return axios.post(UPDATE_KYC_DOCUMENT, {kycDocID, documentName, isActive, updateyBy,ipAddress })
}
export function getKycDocumentByKycDocumentId(kycDocID: number) {
  return axios.post(GET_ALL_KYC_DOCUMENT_BY_KYC_DOCUMENT_ID, {kycDocID})
}
