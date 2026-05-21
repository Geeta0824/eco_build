import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL

// =====================Document Category URL======================
export const GET_ALL_DOCUMENT_CATEGORY = `${BASE_API_URL}/DocumentCategory/GetDocumentCategoryList`
export const POST_CREATE_DOCUMENT_CATEGORY = `${BASE_API_URL}/DocumentCategory/AddDocumentCategoryDetails`
export const ISACTIVE_DOCUMENT_CATEGORY = `${BASE_API_URL}/DocumentCategory/UpdateDocumentCategoryIsactive`
export const DELETE_DOCUMENT_CATEGORY = `${BASE_API_URL}/DocumentCategory/PostDeleteDocumentCategory`
export const UPDATE_DOCUMENT_CATEGORY_BY_DOCUMENT_CATEGORY_ID = `${BASE_API_URL}/DocumentCategory/GetDocumentCategoryBydocumentCategoryID`
export const UPDATE_DOCUMENT_CATEGORY = `${BASE_API_URL}/DocumentCategory/UpdateDocumentCategoryDetails`
export const DOCUMENT_CATEGORY_DROP_DOWN = `${BASE_API_URL}/DocumentCategory/GetDocumentCategoryDropdownList`
export const USER_MAP_DOCUMENT_CATGRY_ID = `${BASE_API_URL}/DocumentCategory/GetRoleWithDocumentCategoryID`
export const Add_Role_MAP_DOCUMENT_CATGRY_ID = `${BASE_API_URL}/DocumentCategory/AddRoleByDocumentCategoryID`

// ===================== User Map================
export function getUserWithDocumentCategoryIDApi(documentCategoryID: number) {
  return axios.post(USER_MAP_DOCUMENT_CATGRY_ID, {documentCategoryID})
}
// ===================== User Map================
export function addRoleByDocumentCategoryIDApi(documentCategoryID: number, roleIDs: string) {
  return axios.post(Add_Role_MAP_DOCUMENT_CATGRY_ID, {documentCategoryID, roleIDs})
}
// ===================== GET All Document==================
export function getDocumentCategoryDropdownApi() {
  return axios.get(DOCUMENT_CATEGORY_DROP_DOWN)
}
// ===================== GET All Document==================
export function getDocumentCategory(roleID: number) {
  return axios.post(GET_ALL_DOCUMENT_CATEGORY, {roleID})
}
// ===================== Create Document===================
export function createDocumentCategoryDetails(
  documentCategoryName: string,
  isActive: boolean,
  createBy: number,
  ipAddress: string
) {
  return axios.post(POST_CREATE_DOCUMENT_CATEGORY, {
    documentCategoryName,
    isActive,
    createBy,
    ipAddress,
  })
}
// ===================== Update Document===================
export function getUpdateDocumentCatgryID(documentCategoryID: number) {
  return axios.post(UPDATE_DOCUMENT_CATEGORY_BY_DOCUMENT_CATEGORY_ID, {documentCategoryID})
}
export function updateDocumentCategory(
  documentCategoryID: number,
  documentCategoryName: string,
  isActive: boolean,
  updateBy: number,
  ipAddress: string
) {
  return axios.post(UPDATE_DOCUMENT_CATEGORY, {
    documentCategoryID,
    documentCategoryName,
    isActive,
    updateBy,
    ipAddress,
  })
}
// ===================== IsActive Document===================
export function isActiveDocument(documentCategoryID: number, isActive: boolean) {
  return axios.post(ISACTIVE_DOCUMENT_CATEGORY, {documentCategoryID, isActive})
}
// ===================== Delete Document================
export function deleteDocumentCategory(documentCategoryID: number) {
  return axios.post(DELETE_DOCUMENT_CATEGORY, {documentCategoryID})
}
