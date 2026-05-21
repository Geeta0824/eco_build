import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL

// =====================DocumentType URL======================
export const GET_ALL_DOCUMENT = `${BASE_API_URL}/DocumentType/GetDocumentTypeWebList`
export const POST_CREATE_DOCUMENT = `${BASE_API_URL}/DocumentType/AddDocumentTypeDetails`
export const ISACTIVE_DOCUMENT = `${BASE_API_URL}/DocumentType/UpdateDocumentTypeIsactive`
export const DELETE_DOCUMENT = `${BASE_API_URL}/DocumentType/PostDeleteDocumentType`
export const UPDATE_DOCUMENT_BY_DOCUMENT_ID = `${BASE_API_URL}/DocumentType/GetDocumentTypeBydocumentTypeID`
export const UPDATE_DOCUMENT = `${BASE_API_URL}/DocumentType/UpdateDocumentTypeDetails`

// ===================== GET All Document==================
export function getDocumentType() {
  return axios.get(GET_ALL_DOCUMENT)
}
// ===================== Create Document===================
export function createDocumentDetails(
  documentTypeName: string,
  isActive: boolean,
  createBy: number,
  ipAddress: string
) {
  return axios.post(POST_CREATE_DOCUMENT, {documentTypeName, isActive, createBy, ipAddress})
}
// ===================== Update Document===================
export function getUpdateDocument(documentTypeID: string) {
  return axios.post(UPDATE_DOCUMENT_BY_DOCUMENT_ID, {documentTypeID})
}
export function updateDocumentType(
  documentTypeID: number,
  documentTypeName: string,
  isActive: boolean,
  updateBy: number,
  ipAddress: string
) {
  return axios.post(UPDATE_DOCUMENT, {
    documentTypeID,
    documentTypeName,
    isActive,
    updateBy,
    ipAddress,
  })
}
// ===================== IsActive Document===================
export function isActiveDocument(documentTypeID: number, isActive: boolean) {
  return axios.post(ISACTIVE_DOCUMENT, {documentTypeID, isActive})
}
// ===================== Delete Document================
export function deleteDocumentType(documentTypeID: number) {
  return axios.post(DELETE_DOCUMENT, {documentTypeID})
}
