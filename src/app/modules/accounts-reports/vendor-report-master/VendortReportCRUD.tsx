import axios from 'axios'
import {number} from 'yup'
const BASE_API_URL = process.env.REACT_APP_API_URL
// =================Change Password=====================
// export const Add_Project_Fund_Recive = `${BASE_API_URL}/Fund/AddProjectFundReceive`
export const Get_VendorReport_VenProjList_By_VendorID = `${BASE_API_URL}/VendorReport/Get_VendorProjList_By_VendorID`
export const Get_Other_Vendor_Report_VenProjList_By_VendorID = `${BASE_API_URL}/VendorReport/Get_OtherVendorProjList_By_VendorID`
export const Get_Project_List_By_Proj_VendorID = `${BASE_API_URL}/VendorReport/GetProjectList_By_Proj_Vend_ID`
export const Get_Stage_Wise_Report = `${BASE_API_URL}/VendorReport/GetStageWiseReport`
export const Get_DIY_StageWise_Report = `${BASE_API_URL}/VendorReport/GetDIYStageWiseReport`
export const Get_Modular_StageWise_Report = `${BASE_API_URL}/VendorReport/GetModularStageWiseReport`
export const Export_Excel_Vendor_Report_List = `${BASE_API_URL}/VendorReport/Get_VendorProjList_By_VendorID_ExportExcel `
export const PMC_Due_Amount_Breakup_List = `${BASE_API_URL}/PMCWorkStageStructure/PMCDueAmountBreakupList`
export const Addon_Work_Due_Amount_Breakup_List = `${BASE_API_URL}/PMCWorkStageStructure/PMCDueAmount_AddonWork_BreakupList`
export const Other_Work_Due_Amount_Breakup_List = `${BASE_API_URL}/PMCWorkStageStructure/OtherVendorDueAmount_Work_BreakupList`
export const Carpetry_DIY_Due_Amount_Breakup_List = `${BASE_API_URL}/DIYStageChange/DIYDueAmountBreakupList`
export const PMC_Modular_Due_Amount_Breakup_List = `${BASE_API_URL}/ModularStages/Modular_Stage_DueAmountBreakupList`
export const Modular_Addon_Work_Due_Amount_Breakup_List = `${BASE_API_URL}/ModularStages/Modular_PMCDueAmount_AddonWork_BreakupList`
export const Modular_Other_Work_Due_Amount_Breakup_List = `${BASE_API_URL}/ModularStages/OtherVendorDueAmount_Work_BreakupList`
export const DIY_DueAmount_OtherWork_BreakupList = `${BASE_API_URL}/DIYStageChange/DIY_DueAmount_OtherWork_BreakupList`

// ============================= Project  Modular ===================
export function getPMCModularDueAmountBreakupListApi(projectID: number, vendorID: number) {
  return axios.post(PMC_Modular_Due_Amount_Breakup_List, {projectID, vendorID})
}

export function getModularAddonWorkDueAmountBreakupListApi(projectID: number, vendorID: number) {
  return axios.post(Modular_Addon_Work_Due_Amount_Breakup_List, {projectID, vendorID})
}
export function getModularOtherWorkDueAmountBreakupListApi(projectID: number, vendorID: number) {
  return axios.post(Modular_Other_Work_Due_Amount_Breakup_List, {projectID, vendorID})
}
// ============================= Project DIY ===================
export function getCarpetryDIYDueAmountBreakupListApi(projectID: number, vendorID: number) {
  return axios.post(Carpetry_DIY_Due_Amount_Breakup_List, {projectID, vendorID})
}
export function ExportExcelVendorReportListApi(vendorID: number) {
  return axios.post(Export_Excel_Vendor_Report_List, {vendorID})
}
export function getOtherVendorReportListByVendorIdApi(vendorID: number) {
  return axios.post(Get_Other_Vendor_Report_VenProjList_By_VendorID, {vendorID})
}
export function getVendorReportListByVendorIdApi(vendorID: number) {
  return axios.post(Get_VendorReport_VenProjList_By_VendorID, {vendorID})
}
export function getProjectListByProjVendorIdApi(
  projectID: number,
  vendorID: number,
  startDate: string,
  endDate: string
) {
  return axios.post(Get_Project_List_By_Proj_VendorID, {projectID, vendorID, startDate, endDate})
}

export function getStageWiseDataByVendorIDAndProjectIDApi(projectID: number, vendorID: number) {
  return axios.post(Get_Stage_Wise_Report, {projectID, vendorID})
}

export function getDIYStageWiseDataByVendorIDAndProjectIDApi(projectID: number, vendorID: number) {
  return axios.post(Get_DIY_StageWise_Report, {projectID, vendorID})
}

export function getModularStageWiseDataByVendorIDAndProjectIDApi(
  projectID: number,
  vendorID: number
) {
  return axios.post(Get_Modular_StageWise_Report, {projectID, vendorID})
}
// ============================= Project Ready Made ===================
export function getPMCDueAmountBreakupListApi(projectID: number, vendorID: number) {
  return axios.post(PMC_Due_Amount_Breakup_List, {projectID, vendorID})
}

export function getAddonWorkDueAmountBreakupListApi(projectID: number, vendorID: number) {
  return axios.post(Addon_Work_Due_Amount_Breakup_List, {projectID, vendorID})
}
export function getOtherWorkDueAmountBreakupListApi(projectID: number, vendorID: number) {
  return axios.post(Other_Work_Due_Amount_Breakup_List, {projectID, vendorID})
}

export function getDIYDueAmountOtherWorkBreakupListListApi(projectID: number, vendorID: number) {
  return axios.post(DIY_DueAmount_OtherWork_BreakupList, {projectID, vendorID})
}
