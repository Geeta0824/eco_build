import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL
//=====================DNC Remarks URL======================

export const AgencyRemarksGetList = `${BASE_API_URL}/AgencyRemarks/AgencyRemarksGetList` //Get DNC Remarks Page
export const RemarksTypeGetList = `${BASE_API_URL}/AgencyRemarks/RemarksTypeGetList` //Get DNC Remarks Page

export const AddAgencyRemarks = `${BASE_API_URL}/AgencyRemarks/AddAgencyRemarks` //Create DNC Remarks Page
export const Quotation_Remarks_DATA_BY_DNC_Remarks_ID = `${BASE_API_URL}/AgencyRemarks/GetAgencyRemarksByID` //Update DNC Remarks Page
export const UPDATE_Agency_Remarks = `${BASE_API_URL}/AgencyRemarks/UpdateAgencyRemarksDetails` //Update DNC Remarks Page
export const GET_Agency_Remarks = `${BASE_API_URL}/AgencyRemarks/GetAgencyRemarksByID` //Update DNC Remarks Page
export const DELETE_DNC_Remarks = `${BASE_API_URL}/AgencyRemarks/DeleteAgencyRemarks` //Delete DNC Remarks Page
export const Update_Agency_Remarks_IsActive = `${BASE_API_URL}/AgencyRemarks/UpdateAgencyRemarksIsactive` //Delete DNC Remarks Page

// ========= GET DNC Remarks =================================
export function AgencyRemarksGetListApi() {
  return axios.get(AgencyRemarksGetList)
}

// ========= GET DNC Remarks =================================
export function RemarksTypeGetListApi() {
  return axios.get(RemarksTypeGetList)
}
// ===================== CREATE DNC Remarks ===================
export function addAgencyRemarksApi(agencyTypeID: number, remarksTypeID: number, remarks: string,isActive:boolean) {
  return axios.post(AddAgencyRemarks, {
    agencyTypeID,
    remarksTypeID,
    remarks,
    isActive
  })
}
// =======================UPDATE DNC Remarks==================
export function getAgencyRemarksDataByAgencyRemarksID(quotationRemarksID: number) {
  return axios.post(Quotation_Remarks_DATA_BY_DNC_Remarks_ID, {
    quotationRemarksID,
  })
}

// ========================= update agency remark =============================
export function updateAgencyRemarksApi(
  agencyRemarksID: number,
  agencyTypeID: number,
  remarksTypeID: number,
  remarks: string,
  isActive:boolean
) {
  return axios.post(UPDATE_Agency_Remarks, {
    agencyRemarksID,
    agencyTypeID,
    remarksTypeID,
    remarks,
    isActive
  })
}
// ========================= get agency remark =============================
export function getAgencyRemarksApi(agencyRemarksID: number) {
  return axios.post(GET_Agency_Remarks, {
    agencyRemarksID,
  })
}
// =======================DELETE DNC Remarks==================
export function deleteAgencyRemarksApi(agencyRemarksID: number) {
  return axios.post(DELETE_DNC_Remarks, {agencyRemarksID})
}
// =======================DELETE DNC Remarks==================
export function UpdateAgencyRemarksIsactive(agencyRemarksID: number, isActive: boolean) {
  return axios.post(Update_Agency_Remarks_IsActive, {agencyRemarksID, isActive})
}
