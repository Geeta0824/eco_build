import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL
//=====================VendorDocMap URL======================
export const GET_ALL_VENDOR_DOC_MAP = `${BASE_API_URL}/VendorDocMap/GeVendorDocMapList`
export const CREATE_VENDOR_DOC_MAP = `${BASE_API_URL}/VendorDocMap/AddVendorDocMapDetails`
export const GET_VENDOR_DOC_MAP_BY_VENDOR_MAP_ID = `${BASE_API_URL}/VendorDocMap/GetVendorDocMapByEmployeeDocMapID`
export const UPDATE_VENDOR_DOC_MAP = `${BASE_API_URL}/VendorDocMap/UpdateVendorDocMapDetails`
export const ISACTIVE_VENDOR_DOC_MAP = `${BASE_API_URL}/VendorDocMap/UpdateVendorDocMapIsactive`
export const DELETE_VENDOR_DOC_MAP = `${BASE_API_URL}/VendorDocMap/PostDeleteVendorDocMap`
export const GET_VENDOR_DOC_MAP = `${BASE_API_URL}/VendorDocMap/GetVendorDocMapByEmpID`

// export function getAllVendorDocMap() {
//   return axios.get(GET_ALL_VENDOR_DOC_MAP)
// }

export function getVendorDocMap(VendorID: number) {
  return axios.post(GET_VENDOR_DOC_MAP, {VendorID})
}

export function createVendorDocMap(
  VendorID: number,
  documentTypeID: number,
  docNumber: string,
  description: string,
  mediaTypeID: number,
  filePath: string,
  isActive: boolean,
  createBy: number,
  ipAddress: string
) {
  return axios.post(CREATE_VENDOR_DOC_MAP, {
    VendorID,
    documentTypeID,
    docNumber,
    description,
    mediaTypeID,
    filePath,
    isActive,
    createBy,
    ipAddress,
  })
}
export function getVendorDocMapByVendorDocMapId(VendorDocID: string) {
  return axios.post(GET_VENDOR_DOC_MAP_BY_VENDOR_MAP_ID, {VendorDocID})
}
export function updateVendorDocMap(
  VendorDocID: number,
  VendorID: number,
  documentTypeID: number,
  docNumber: string,
  description: string,
  mediaTypeID: number,
  filePath: string,
  isActive: boolean,
  updateBy: number,
  ipAddress: string
) {
  return axios.post(UPDATE_VENDOR_DOC_MAP, {
    VendorDocID,
    VendorID,
    documentTypeID,
    docNumber,
    description,
    mediaTypeID,
    filePath,
    isActive,
    updateBy,
    ipAddress,
  })
}
export function isActiveVendorDocMap(VendorDocID: number, isActive: boolean) {
  return axios.post(ISACTIVE_VENDOR_DOC_MAP, {VendorDocID, isActive})
}
export function deleteVendorDocMap(VendorDocID: number) {
  return axios.post(DELETE_VENDOR_DOC_MAP, {VendorDocID})
}
