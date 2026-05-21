import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL
// =================Emp Education URL=====================
export const GET_ALL_STANDARD_QUOTATION = `${BASE_API_URL}/StandardQuotation/GetStandarQuotationDataList`
// export const GET_Active_STANDARD_QUOTATION = `${BASE_API_URL}/StandardQuotation/GetDropDownStandardQuotationList`
export const CREATE_STANDARD_QUOTATION = `${BASE_API_URL}/StandardQuotation/AddStandardQuotationData`
export const GET_STANDARD_QUOTATION_BY_STANDARD_QUOTATION_ID = `${BASE_API_URL}/StandardQuotation/GetStandarQuotationDataByID`
export const UPDATE_STANDARD_QUOTATION = `${BASE_API_URL}/StandardQuotation/UpdateStandardQuotationData`
export const DELETE_STANDARD_QUOTATION = `${BASE_API_URL}/StandardQuotation/DeleteStandarQuotationDataByID`
export const ISACTIVE_STANDARD_QUOTATION = `${BASE_API_URL}/StandardQuotation/UpdateStandardQuotationIsactive`

export function getFilterAllStandardQuotation(
  carpetAreaID: number,
  bhkID: number,
  projectTypeID: number,
  sortBy: number,
  sortType: number,
  searchText: string
) {
  return axios.post(GET_ALL_STANDARD_QUOTATION, {
    carpetAreaID,
    bhkID,
    projectTypeID,
    sortBy,
    sortType,
    searchText,
  })
}

// export function getActiveStandardQuotation() {
//   return axios.get(GET_Active_STANDARD_QUOTATION)
// }

export function createStandardQuotation(
  bhkID: number,
  projectTypeID: number,
  carpetAreaID: number,
  filePath: string,
  isActive: boolean,
  createBy: number,
  ipAddress: string
) {
  return axios.post(CREATE_STANDARD_QUOTATION, {
    bhkID,
    projectTypeID,
    carpetAreaID,
    filePath,
    isActive,
    createBy,
    ipAddress,
  })
}

export function getStandardQuotationByStandardQuotationId(standarQuotationPDFID: number) {
  return axios.post(GET_STANDARD_QUOTATION_BY_STANDARD_QUOTATION_ID, {standarQuotationPDFID})
}
export function updatStandardQuotation(
  standarQuotationPDFID: number,
  bhkID: number,
  projectTypeID: number,
  carpetAreaID: number,
  filePath: string,
  isActive: boolean,
  updateBy: number,
  ipAddress: string
) {
  return axios.post(UPDATE_STANDARD_QUOTATION, {
    standarQuotationPDFID,
    bhkID,
    projectTypeID,
    carpetAreaID,
    filePath,
    isActive,
    updateBy,
    ipAddress,
  })
}
export function deleteStandardQuotation(standarQuotationPDFID: number) {
  return axios.post(DELETE_STANDARD_QUOTATION, {standarQuotationPDFID})
}
export function isActiveStandardQuotation(standarQuotationPDFID: number, isActive: boolean) {
  return axios.post(ISACTIVE_STANDARD_QUOTATION, {standarQuotationPDFID, isActive})
}
