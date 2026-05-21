import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL
// =================Department URL=====================
export const PMC_Stage_Change_Req_List = `${BASE_API_URL}/PMCWorkStageStructure/PMCStageChangeReqList`
export const Project_Stage_Change_Approve = `${BASE_API_URL}/PMCWorkStageStructure/ProjectStageChangeApprove`
export const PMC_AddonWork_StageChangeReqList = `${BASE_API_URL}/PMCWorkStageStructure/PMC_AddonWork_StageChangeReqList`
export const Other_Work_Order_Stage_Change_ReqList = `${BASE_API_URL}/PMCWorkStageStructure/Other_WorkOrder_StageChangeReqList`
export const Project_PMC_AddonWork_Stage_Change_Approve = `${BASE_API_URL}/PMCWorkStageStructure/Project_PMC_AddonWork_StageChangeApprove`
export const Project_Other_Vendor_Work_Stage_Change_Approve = `${BASE_API_URL}/PMCWorkStageStructure/Project_OtherVendor_Work_StageChangeApprove`
export const DIY_Project_Stage_Change_Approve = `${BASE_API_URL}/DIYStageChange/DIYProjectStageChangeApprove`
export const DIY_StageChange_Req_List_ForAdmin = `${BASE_API_URL}/DIYStageChange/DIYStageChangeReqListForAdmin`
export const DIY_OtherWorkOrder_StagReqList_ForAdmin = `${BASE_API_URL}/DIYStageChange/DIY_OtherWorkOrder_StagReqList_ForAdmin`
export const DIY_Other_Work_StageChangeApprove = `${BASE_API_URL}/DIYStageChange/DIY_Other_Work_StageChangeApprove`
// =========================Get ProjectStatus_List=====================

export function PMCStageChangeReqListAPI() {
  return axios.get(PMC_Stage_Change_Req_List)
}

export function addonWorkOrderChangeReqListAPI() {
  return axios.get(PMC_AddonWork_StageChangeReqList)
}
export function pmcOtherWorkChangeReqListAPI() {
  return axios.get(Other_Work_Order_Stage_Change_ReqList)
}
export function ProjectStageChangeApproveAPI(
  projectVendorPaymentStructureID: number,
  employeeID: number
) {
  return axios.post(Project_Stage_Change_Approve, {projectVendorPaymentStructureID, employeeID})
}
export function projectAddonWorkChangeApproveAPI(
  projectVendorPaymentStructureID: number,
  employeeID: number
) {
  return axios.post(Project_PMC_AddonWork_Stage_Change_Approve, {
    projectVendorPaymentStructureID,
    employeeID,
  })
}
export function projectOtherVendorChangeApproveAPI(
  projectVendorPaymentStructureID: number,
  employeeID: number
) {
  return axios.post(Project_Other_Vendor_Work_Stage_Change_Approve, {
    projectVendorPaymentStructureID,
    employeeID,
  })
}

export function projectDIYStageChangeApproveAPI(
  vendorAgencyWorkStageID: number,
  employeeID: number
) {
  return axios.post(DIY_Project_Stage_Change_Approve, {
    vendorAgencyWorkStageID,
    employeeID,
  })
}

export function DIYStageChangeReqListAPI() {
  return axios.get(DIY_StageChange_Req_List_ForAdmin)
}

export function DIYOtherWorkOrderStagReqListForAdminReqListAPI() {
  return axios.get(DIY_OtherWorkOrder_StagReqList_ForAdmin)
}

export function DIYOtherWorkStageChangeApproveAPI(
  projectVendorPaymentStructureID: number,
  employeeID: number
) {
  return axios.post(DIY_Other_Work_StageChangeApprove, {
    projectVendorPaymentStructureID,
    employeeID,
  })
}
