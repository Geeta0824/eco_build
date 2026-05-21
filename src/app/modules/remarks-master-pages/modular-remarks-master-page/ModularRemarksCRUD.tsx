import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL
//=====================Modular Remarks URL======================

export const GET_ALL_Modular_Remarks = `${BASE_API_URL}/ModularRemarks/QuotationRemarksGetList` //Get Modular Remarks Page
export const ADD_ALL_Modular_Remarks = `${BASE_API_URL}/ModularRemarks/AddQuotationRemarks` //Create Modular Remarks Page
export const Quotation_Remarks_DATA_BY_Modular_Remarks_ID = `${BASE_API_URL}/ModularRemarks/GetDataQuotationRemarksByID` //Update Modular Remarks Page
export const UPDATE_Modular_Remarks = `${BASE_API_URL}/ModularRemarks/UpdateQuotationRemarksDetails` //Update Modular Remarks Page
export const DELETE_Modular_Remarks = `${BASE_API_URL}/ModularRemarks/DeleteQuotationRemarks               ` //Delete Modular Remarks Page
export const Update_Quotation_Remarks_Isactive = `${BASE_API_URL}/ModularRemarks/UpdateQuotationRemarksIsactive               ` //Delete Modular Remarks Page

// ========= GET Modular Remarks =================================
export function getAllModularRemarkApi() {
  return axios.get(GET_ALL_Modular_Remarks)
}
// ===================== CREATE Modular Remarks ===================
export function addModularRemarkApi(
  typeID: number,
  Remarks: string,
  isActive:boolean
  // createBy: number,
  // ipAddress: string
) {
  return axios.post(ADD_ALL_Modular_Remarks, {
    typeID,
    Remarks,
    isActive
    // createBy,
    // ipAddress,
  })
}
// =======================UPDATE Modular Remarks==================
export function getModularRemarkDataByModularRemarkID(
    quotationRemarksID: number
) {
  return axios.post(Quotation_Remarks_DATA_BY_Modular_Remarks_ID, {
    quotationRemarksID,
  })
}

// ======================================================
export function updateModularRemarkApi(
 quotationRemarksID: number,
  typeID: number,
  Remarks: string,
  isActive:boolean
  // updateBy: number,
  // ipAddress: string
) {
  return axios.post(UPDATE_Modular_Remarks, {
   quotationRemarksID,
    typeID,
    Remarks,
    isActive
    // updateBy,
    // ipAddress,
  })
}
// =======================DELETE Modular Remarks==================
export function deleteModularRemarkApi(quotationRemarksID: number) {
  return axios.post(DELETE_Modular_Remarks, {quotationRemarksID})
}
// =======================active Modular Remarks==================
export function UpdateQuotationRemarksIsactive(quotationRemarksID: number,isActive:boolean) {
  return axios.post(Update_Quotation_Remarks_Isactive, {quotationRemarksID,isActive})
}
