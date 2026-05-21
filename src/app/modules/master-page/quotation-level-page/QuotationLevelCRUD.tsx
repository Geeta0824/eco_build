import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL
// =================QuotationLevel URL=====================
export const GET_ALL_Quotation_Level = `${BASE_API_URL}/QuotationLevel/GetQuotationLevelWebList`
export const GET_Quotation_Level_BY_Quotation_Level_ID = `${BASE_API_URL}/QuotationLevel/GetQuotationLevelByQuotationLevelID`
export const DELETE_Quotation_Level_DETAILS = `${BASE_API_URL}/QuotationLevel/PostDeleteQuotationLevel`
export const UPDATE_Quotation_Level = `${BASE_API_URL}/QuotationLevel/UpdateQuotationLevelDetails`
export const ADD_Quotation_Level = `${BASE_API_URL}/QuotationLevel/AddQuotationLevelDetails`
export const Get_Employee_List_With_QuotationLevel_ID = `${BASE_API_URL}/QuotationLevel/GetEmployeeWithQuotationLevelID`
export const Add_Employee_MAP_QuotationLevel_ID = `${BASE_API_URL}/QuotationLevel/AddEmployeeByQuotationLevelID`

export function getAllQuotationLevel() {
  return axios.get(GET_ALL_Quotation_Level)
}

export function getQuotationLevelByQuotationLevelId(quotationLevelID: number) {
  return axios.post(GET_Quotation_Level_BY_Quotation_Level_ID, {quotationLevelID})
}
export function deleteQuotationLevelDetails(quotationLevelID: number) {
  return axios.post(DELETE_Quotation_Level_DETAILS, {quotationLevelID})
}
export function updateQuotationLevel(quotationLevelID: number, quotationLevelName: string) {
  return axios.post(UPDATE_Quotation_Level, {
    quotationLevelID,
    quotationLevelName,
  })
}
export function addQuotationLevelAPI(quotationLevelName: string) {
  return axios.post(ADD_Quotation_Level, {
    quotationLevelName,
  })
}

// ===================== User Map================
export function getEmployeeListWithQuotationLevelIDApi(quotationLevelID: number) {
  return axios.post(Get_Employee_List_With_QuotationLevel_ID, {quotationLevelID})
}
// ===================== User Map================
export function addEmployeeByQuotationLevelIDApi(quotationLevelID: number, employeeIDs: string) {
  return axios.post(Add_Employee_MAP_QuotationLevel_ID, {quotationLevelID, employeeIDs})
}
