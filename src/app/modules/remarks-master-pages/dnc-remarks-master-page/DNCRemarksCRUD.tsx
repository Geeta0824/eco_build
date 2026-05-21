import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL
//=====================DNC Remarks URL======================

export const GET_ALL_DNC_Remarks = `${BASE_API_URL}/DNCRemarks/QuotationRemarksGetList` //Get DNC Remarks Page
export const ADD_ALL_DNC_Remarks = `${BASE_API_URL}/DNCRemarks/AddQuotationRemarks` //Create DNC Remarks Page
export const Quotation_Remarks_DATA_BY_DNC_Remarks_ID = `${BASE_API_URL}/DNCRemarks/GetDataQuotationRemarksByID` //Update DNC Remarks Page
export const UPDATE_DNC_Remarks = `${BASE_API_URL}/DNCRemarks/UpdateQuotationRemarksDetails` //Update DNC Remarks Page
export const DELETE_DNC_Remarks = `${BASE_API_URL}/DNCRemarks/DeleteQuotationRemarks` //Delete DNC Remarks Page
export const DROPDOWN_DNC_REMARK = `${BASE_API_URL}/DNCRemarks/GetDNCTypeDropdownList` //Dropdown DNC Remarks Page
export const IS_ACTIVE_DNC_REMARK = `${BASE_API_URL}/DNCRemarks/UpdateQuotationRemarksIsactive` //IsActive DNC Remarks Page

// ========= GET DNC Remarks =================================
export function getAllDNCRemarksApi() {
  return axios.get(GET_ALL_DNC_Remarks)
}
// ===================== CREATE DNC Remarks ===================
export function addDNCRemarksApi(
  typeID: number,
  Remarks: string,
  isActive: boolean,
  createBy: number,
  ipAddress: string
) {
  return axios.post(ADD_ALL_DNC_Remarks, {
    typeID,
    Remarks,
    isActive,
    createBy,
    ipAddress,
  })
}
// =======================UPDATE DNC Remarks==================
export function getDNCRemarksDataByDNCRemarksID(quotationRemarksID: number) {
  return axios.post(Quotation_Remarks_DATA_BY_DNC_Remarks_ID, {
    quotationRemarksID,
  })
}

// ======================================================
export function updateDNCRemarksApi(
  quotationRemarksID: number,
  typeID: number,
  Remarks: string,
  isActive: boolean,
  updateBy: number,
  ipAddress: string
) {
  return axios.post(UPDATE_DNC_Remarks, {
    quotationRemarksID,
    typeID,
    Remarks,
    isActive,
    updateBy,
    ipAddress,
  })
}
// =======================DELETE DNC Remarks==================
export function deleteDNCRemarksApi(quotationRemarksID: number) {
  return axios.post(DELETE_DNC_Remarks, {quotationRemarksID})
}
// =======================DROPDOWN DNC Remarks==================
export function DNCRemarksDropdownApi() {
  return axios.get(DROPDOWN_DNC_REMARK)
}
// =======================DROPDOWN DNC Remarks==================
export function isActiveDNCRemarks(quotationRemarksID: number, isActive: boolean) {
  return axios.post(IS_ACTIVE_DNC_REMARK, {quotationRemarksID, isActive})
}
