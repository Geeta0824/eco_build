import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL

// =====================Document Mst URL======================
export const GET_ALL_DOCUMENT_BY_DOCUMENTCATEGORYID = `${BASE_API_URL}/Document/GetDocumentListByDocumentCategoryID`
export const POST_CREATE_DOCUMENT_MST = `${BASE_API_URL}/Document/AddDocumentDetails`
export const ISACTIVE_DOCUMENT_MST = `${BASE_API_URL}/Document/UpdateDocumentIsactive`
export const DELETE_DOCUMENT_MST = `${BASE_API_URL}/Document/PostDeleteDocument`
export const UPDATE_DOCUMENT_MST_BY_DOCUMENT_MST_ID = `${BASE_API_URL}/Document/GetDocumentByDocumentID`
export const UPDATE_DOCUMENT_MST = `${BASE_API_URL}/Document/UpdateDocumentDetails`
export const Get_Document_DOCUMENT_By_Role_ID = `${BASE_API_URL}/Document/GetDocumentList_ByRoleID`

// ===================== GET All Document==================
export function getHRDocumentByRoleID(roleID: number, documentCategoryID: number) {
  return axios.post(Get_Document_DOCUMENT_By_Role_ID, {roleID, documentCategoryID})
}
// ===================== GET All Document==================
export function getDocumentListByDocumentCategoryIDApi(documentCategoryID: number) {
  return axios.post(GET_ALL_DOCUMENT_BY_DOCUMENTCATEGORYID, {documentCategoryID})
}
// ===================== Create Document===================
export function createDocumentMstDetails(
  documentName: string,
  documentCategoryID: number,
  attachFile: string,
  isActive: boolean,
  createBy: number,
  ipAddress: string
) {
  return axios.post(POST_CREATE_DOCUMENT_MST, {
    documentName,
    documentCategoryID,
    attachFile,
    isActive,
    createBy,
    ipAddress,
  })
}
// ===================== Update Document===================
export function updateDocumentByID(documentID: number) {
  return axios.post(UPDATE_DOCUMENT_MST_BY_DOCUMENT_MST_ID, {documentID})
}
export function getUpdateDocumentMst(
  documentID: number,
  documentCategoryID: number,
  documentName: string,
  attachFile: string,
  isActive: boolean,
  updateBy: number,
  ipAddress: string
) {
  return axios.post(UPDATE_DOCUMENT_MST, {
    documentID,
    documentCategoryID,
    documentName,
    attachFile,
    isActive,
    updateBy,
    ipAddress,
  })
}
// ===================== IsActive Document===================
export function isActiveDocumentMst(documentID: number, isActive: boolean) {
  return axios.post(ISACTIVE_DOCUMENT_MST, {documentID, isActive})
}
// ===================== Delete Document================
export function deleteDocumentMst(documentID: number) {
  return axios.post(DELETE_DOCUMENT_MST, {documentID})
}
