import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL
//=====================Quotation Remarks URL======================
export const GET_ALL_Quotation_Remarks = `${BASE_API_URL}/QuotationRemarks/QuotationRemarksGetList` //Get Quotation Remarks Page
export const ADD_ALL_Quotation_Remarks = `${BASE_API_URL}/QuotationRemarks/AddQuotationRemarks` //Create Quotation Remarks Page
export const Quotation_Remarks_DATA_BY_Quotation_Remarks_ID = `${BASE_API_URL}/QuotationRemarks/GetDataQuotationRemarksByID` //Update Quotation Remarks Page
export const UPDATE_Quotation_Remarks = `${BASE_API_URL}/QuotationRemarks/UpdateQuotationRemarksDetails` //Update Quotation Remarks Page
export const DELETE_Quotation_Remarks = `${BASE_API_URL}/QuotationRemarks/DeleteQuotationRemarks               ` //Delete Quotation Remarks Page
export const Update_Quotation_Remarks_Isactive = `${BASE_API_URL}/QuotationRemarks/UpdateQuotationRemarksIsactive               ` //Delete Quotation Remarks Page

// ========= GET Quotation Remarks =================================
export function getAllQuotationRemarksApi() {
  return axios.get(GET_ALL_Quotation_Remarks)
}
// ===================== CREATE Quotation Remarks ===================
export function addQuotationRemarksApi(
  typeID: number,
  Remarks: string,
  isActive:boolean
  // createBy: number,
  // ipAddress: string
) {
  return axios.post(ADD_ALL_Quotation_Remarks, {
    typeID,
    Remarks,
    isActive
    // createBy,
    // ipAddress,
  })
}
// =======================UPDATE Quotation Remarks==================
export function getQuotationRemarksDataByQuotationRemarksID(
    QuotationRemarksID: number
) {
  return axios.post(Quotation_Remarks_DATA_BY_Quotation_Remarks_ID, {
    QuotationRemarksID,
  })
}

// ======================================================
export function updateQuotationRemarksApi(
 quotationRemarksID: number,
  typeID: number,
  Remarks: string,
  isActive:boolean
  // updateBy: number,
  // ipAddress: string
) {
  return axios.post(UPDATE_Quotation_Remarks, {
   quotationRemarksID,
    typeID,
    Remarks,
    isActive
    // updateBy,
    // ipAddress,
  })
}
// =======================DELETE Quotation Remarks==================
export function deleteQuotationRemarksApi(QuotationRemarksID: number) {
  return axios.post(DELETE_Quotation_Remarks, {QuotationRemarksID})
}
export function UpdateQuotationRemarksIsactive(quotationRemarksID: number,isActive:boolean) {
  return axios.post(Update_Quotation_Remarks_Isactive, {quotationRemarksID,isActive})
}
