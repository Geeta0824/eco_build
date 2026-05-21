import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL

// =====================DocumentType URL======================
export const GET_ALL_DOCUMENT = `${BASE_API_URL}/DocumentType_New/GetDocumentTypeWebList`
export const POST_CREATE_DOCUMENT = `${BASE_API_URL}/DocumentType_New/AddDocumentTypeDetails`
export const ISACTIVE_DOCUMENT = `${BASE_API_URL}/DocumentType_New/UpdateDocumentTypeIsactive`
export const DELETE_DOCUMENT = `${BASE_API_URL}/DocumentType_New/PostDeleteDocumentType`
export const UPDATE_DOCUMENT_BY_DOCUMENT_ID = `${BASE_API_URL}/DocumentType_New/GetDocumentTypeBydocumentTypeID`
export const UPDATE_DOCUMENT = `${BASE_API_URL}/DocumentType_New/UpdateDocumentTypeDetails`

// ===================== GET All Document==================
export function getDocumentType() {
  return axios.get(GET_ALL_DOCUMENT)
}
// ===================== Create Document===================
export function createDocumentDetails(encodedReq: string) {
  return axios.post(POST_CREATE_DOCUMENT, {encodedReq})
}
// ===================== Update Document===================
export function getUpdateDocument(encodedReq: string) {
  return axios.post(UPDATE_DOCUMENT_BY_DOCUMENT_ID, {encodedReq})
}
export function updateDocumentType(encodedReq: string) {
  return axios.post(UPDATE_DOCUMENT, {encodedReq})
}
// ===================== IsActive Document===================
export function isActiveDocument(encodedReq: string) {
  return axios.post(ISACTIVE_DOCUMENT, {encodedReq})
}
// ===================== Delete Document================
export function deleteDocumentType(encodedReq: string) {
  return axios.post(DELETE_DOCUMENT, {encodedReq})
}
