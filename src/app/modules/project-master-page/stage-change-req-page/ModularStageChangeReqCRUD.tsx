import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL
// =================Department URL=====================
export const ModularStageChangeReqListForAdmin = `${BASE_API_URL}/ModularStages/ModularStageChangeReqListForAdmin`
export const Modular_PMC_AddonWork_StageReqList_ForAdmin = `${BASE_API_URL}/ModularStages/Modular_PMC_AddonWork_StageReqList_ForAdmin`
export const Modualr_Other_WorkOrder_StagReqList_ForAdmin = `${BASE_API_URL}/ModularStages/Modualr_Other_WorkOrder_StagReqList_ForAdmin`
export const ModularProjectStageChangeApprove = `${BASE_API_URL}/ModularStages/ModularProjectStageChangeApprove`
export const Modular_PMC_AddonWork_StageChangeApprove = `${BASE_API_URL}/ModularStages/Modular_PMC_AddonWork_StageChangeApprove`
export const Modualr_OtherVendor_Work_StageChangeApprove = `${BASE_API_URL}/ModularStages/Modualr_OtherVendor_Work_StageChangeApprove`

// =========================Get ProjectStatus_List=====================

export function ModularStageChangeReqListForAdminReqListAPI() {
  return axios.get(ModularStageChangeReqListForAdmin)
}

export function ModularPMCAddonWorkStageReqListForAdminReqListAPI() {
  return axios.get(Modular_PMC_AddonWork_StageReqList_ForAdmin)
}
export function ModualrOtherWorkOrderStagReqListForAdminReqListAPI() {
  return axios.get(Modualr_Other_WorkOrder_StagReqList_ForAdmin)
}

export function ModularProjectStageChangeApproveReqAPI(
  vendorAgencyWorkStageID: number,
  employeeID: number
) {
  return axios.post(ModularProjectStageChangeApprove, {vendorAgencyWorkStageID, employeeID})
}

export function ModularPMCAddonWorkStageChangeApproveReqAPI(
  projectVendorPaymentStructureID: number,
  employeeID: number
) {
  return axios.post(Modular_PMC_AddonWork_StageChangeApprove, {
    projectVendorPaymentStructureID,
    employeeID,
  })
}
export function ModualrOtherVendorWorkStageChangeApproveReqAPI(
  projectVendorPaymentStructureID: number,
  employeeID: number
) {
  return axios.post(Modualr_OtherVendor_Work_StageChangeApprove, {
    projectVendorPaymentStructureID,
    employeeID,
  })
}
