import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL
//=====================PMC WARK STAGE URL========================
export const GET_ALL_PMC_WORK_STAGE_STRUCTURE_LIST = `${BASE_API_URL}/PMCWorkStageStructure/GetPMCWorkStageStructureWebList` //Get State Page
export const POST_ALL_PMC_WORK_STAGE_STRUCTURE = `${BASE_API_URL}/PMCWorkStageStructure/AddPMCWorkStageStructureDetails` //Create State Page
export const PMC_WORK_STAGE_STRUCTURE_DATA_BY_PMC_WORK_STAGE_ID = `${BASE_API_URL}/PMCWorkStageStructure/GetPMCWorkStageStructureByPMCWorkStageID` //Update State Page
export const UPDATE_PMC_WORK_STAGE_STRUCTURE = `${BASE_API_URL}/PMCWorkStageStructure/UpdatePMCWorkStageStructureDetails` //Update State Page
export const DELETE_PMC_WORK_STAGE_STRUCTURE = `${BASE_API_URL}/PMCWorkStageStructure/DeletePMCWorkStageStructure` //Delete State Page
export const GET_DROPDOWN_PMC_WORK_STAGE_STRUCTURE_LIST = `${BASE_API_URL}/PMCWorkStageStructure/GetDropDownPMCWorkStageStructureList` //Is Active State Page
export const Get_PMCWorkStageList_For_SupervisorBy_ProjectID = `${BASE_API_URL}/PMCWorkStageStructure/GetPMCWorkStageListForSupervisorByProjectID` //Is Active State Page
export const PMC_Vendor_Stage_Change = `${BASE_API_URL}/PMCWorkStageStructure/PMCVendorStageChange` //Is Active State Page
export const Get_Addon_Work_List_For_Supervisor_By_ProjectID = `${BASE_API_URL}/PMCWorkStageStructure/GetAddonWorkListForSupervisorByProjectID` //Is Active State Page
export const Get_Other_Vendor_Work_List_For_Supervisor_By_ProjectID = `${BASE_API_URL}/PMCWorkStageStructure/GetOtherVendorWorkListForSupervisorByProjectID` //Is Active State Page
export const PMC_Addon_Work_Vendor_Stage_Change = `${BASE_API_URL}/PMCWorkStageStructure/PMC_AddonWork_VendorStageChange` //Add Addon
export const OtherVendor_WorkOrder_Vendor_Stage_Change = `${BASE_API_URL}/PMCWorkStageStructure/OtherVendor_WorkOrder_VendorStageChange` //Add Other
export const Get_DIY_StageList_For_SuperVisorBy_ProjectID = `${BASE_API_URL}/AgencyWorkStage/Get_DIY_StageList_For_SuperVisorBy_ProjectID` //Add Other
export const DIY_Vendor_Stage_Change = `${BASE_API_URL}/DIYStageChange/DIYVendorStageChange` //Add Other
export const Get_Modular_StageList_For_SuperVisorBy_ProjectID = `${BASE_API_URL}/ModularStages/Get_Modular_StageList_For_SuperVisorBy_ProjectID` //Add Other
export const Get_Modular_Addon_Work_List_For_Supervisor_By_ProjectID = `${BASE_API_URL}/ModularStages/GetModular_AddonWorkForSupervisorByProjectID` //Add Other
export const Get_Modular_Other_Vendor_Work_List_For_Supervisor_By_ProjectID = `${BASE_API_URL}/ModularStages/GetModularOtherVendorWorkListForSupervisorByProjectID` //Add Other
export const Modular_Vendor_Stage_Change = `${BASE_API_URL}/ModularStages/ModularVendorStageChange` //Add Other
export const Modular_Other_Vendor_WorkOrder_Vendor_Stage_Change = `${BASE_API_URL}/ModularStages/Modualr_OtherVendor_WorkOrder_VendorStageChange` //Add Other
export const Modular_Addon_WorkOrder_Vendor_Stage_Change = `${BASE_API_URL}/ModularStages/Modular_PMC_AddonWork_VendorStageChange` //Add Other
export const DIY_Other_Wark_Stage_Change = `${BASE_API_URL}/DIYStageChange/DIY_OtherWorkOrder_VendorStageChange` //Add Other
export const Get_DIY_Other_Wark_For_SuperVisorBy_ProjectID = `${BASE_API_URL}/DIYStageChange/GetDIYOtherWorkListForSupervisorByProjectID` //Add Other
export const Get_StageList_For_DesignerBy_ProjectID = `${BASE_API_URL}/DesignerWorkStage/Get_StageList_For_DesignerBy_ProjectID` //Add Other
export const Add_ProjectDesignStage_ChangeByDesigner = `${BASE_API_URL}/DesignerWorkStage/Add_ProjectDesignStage_ChangeByDesigner` //Add Other
export const DesignStageChangeReqListForDesigner = `${BASE_API_URL}/DesignerWorkStage/DesignStageChangeReqListForDesigner` //Add Other
export const Approve_ProjectDesignStage_ByDesigner = `${BASE_API_URL}/DesignerWorkStage/Approve_ProjectDesignStage_ByDesigner` //Add Other
export const Reject_ProjectDesignStage_ByDM_Admin = `${BASE_API_URL}/DesignerWorkStage/Reject_ProjectDesignStage_ByDM_Admin` //Add Other

// ================== GET Modular PMC STRUCTURE ============================
export function getModularWorkStageListForSupervisorByProjectIDAPI(projectID: number) {
  return axios.post(Get_Modular_StageList_For_SuperVisorBy_ProjectID, {projectID})
}

export function getModularAddonWorkListForSupervisorByProjectID(projectID: number) {
  return axios.post(Get_Modular_Addon_Work_List_For_Supervisor_By_ProjectID, {projectID})
}
export function getModularOtherVendorWorkListForSupervisorByProjectID(projectID: number) {
  return axios.post(Get_Modular_Other_Vendor_Work_List_For_Supervisor_By_ProjectID, {projectID})
}
// ================== GET PMC Addon WORK STAGE STRUCTURE ============================
export function getAddonWorkListForSupervisorByProjectID(projectID: number) {
  return axios.post(Get_Addon_Work_List_For_Supervisor_By_ProjectID, {projectID})
}
export function getOtherVendorWorkListForSupervisorByProjectID(projectID: number) {
  return axios.post(Get_Other_Vendor_Work_List_For_Supervisor_By_ProjectID, {projectID})
}
// =======================Addon Work & Other Vendor Work Add Api ======================
export function PMCAddonWorkVendorStageChangeAPI(
  projectVendorPaymentStructureIDs: string,
  employeeID: number
) {
  return axios.post(PMC_Addon_Work_Vendor_Stage_Change, {
    projectVendorPaymentStructureIDs,
    employeeID,
  })
}
export function OtherVendorWorkOrderVendorStageChangeAPI(
  projectVendorPaymentStructureIDs: string,
  employeeID: number
) {
  return axios.post(OtherVendor_WorkOrder_Vendor_Stage_Change, {
    projectVendorPaymentStructureIDs,
    employeeID,
  })
}

// ================== GET PMC WORK STAGE STRUCTURE ============================
export function getPMCWorkStageStructure() {
  return axios.get(GET_ALL_PMC_WORK_STAGE_STRUCTURE_LIST)
}

export function createPMCWorkStageStructure(
  sequenceNo: number,
  stageName: string,
  amtPercentage: number,
  createBy: number,
  ipAddress: string
) {
  return axios.post(POST_ALL_PMC_WORK_STAGE_STRUCTURE, {
    sequenceNo,
    stageName,
    amtPercentage,
    createBy,
    ipAddress,
  })
}
// ============== UPDATE PMC WORK STAGE STRUCTURE ============================
export function getPMCWorkStageStructureByPMCWorkStageID(pmcWorkStageID: number) {
  return axios.post(PMC_WORK_STAGE_STRUCTURE_DATA_BY_PMC_WORK_STAGE_ID, {pmcWorkStageID})
}
export function updatePMCWorkStageStructure(
  pmcWorkStageID: number,
  sequenceNo: number,
  stageName: string,
  amtPercentage: number,
  updateBy: number,
  ipAddress: string
) {
  return axios.post(UPDATE_PMC_WORK_STAGE_STRUCTURE, {
    pmcWorkStageID,
    sequenceNo,
    stageName,
    amtPercentage,
    updateBy,
    ipAddress,
  })
}
// ============== DELETE PMC WORK STAGE STRUCTURE =================
export function deletePMCWorkStageStructure(pmcWorkStageID: number) {
  return axios.post(DELETE_PMC_WORK_STAGE_STRUCTURE, {pmcWorkStageID})
}

// ===================== DROPDOWN PMC WORK STAGE STRUCTURE =======================================
export function getDropDownPMCWorkStageStructureList() {
  return axios.get(GET_DROPDOWN_PMC_WORK_STAGE_STRUCTURE_LIST, {})
}

export function GetPMCWorkStageListForSupervisorByProjectIDAPI(projectID: number) {
  return axios.post(Get_PMCWorkStageList_For_SupervisorBy_ProjectID, {projectID})
}

export function PMCVendorStageChangeAPI(
  projectVendorPaymentStructureIDs: string,
  employeeID: number
) {
  return axios.post(PMC_Vendor_Stage_Change, {projectVendorPaymentStructureIDs, employeeID})
}

// ================= diy ====================
export function GetDIYWorkStageListForSupervisorByProjectIDAPI(projectID: number) {
  return axios.post(Get_DIY_StageList_For_SuperVisorBy_ProjectID, {projectID})
}
export function getDiyOtherWorkStageListForSupervisorByProjectIDAPI(projectID: number) {
  return axios.post(Get_DIY_Other_Wark_For_SuperVisorBy_ProjectID, {projectID})
}
export function DIYWorkStageOrderVendorStageChangeAPI(
  projectVendorPaymentStructureIDs: string,
  employeeID: number
) {
  return axios.post(DIY_Vendor_Stage_Change, {projectVendorPaymentStructureIDs, employeeID})
}
export function diyOtherWarkStageChangeAPI(
  projectVendorPaymentStructureIDs: string,
  employeeID: number
) {
  return axios.post(DIY_Other_Wark_Stage_Change, {projectVendorPaymentStructureIDs, employeeID})
}

// ================ Modular ===================
export function ModularWorkStageOrderVendorStageChangeAPI(
  projectVendorPaymentStructureIDs: string,
  employeeID: number
) {
  return axios.post(Modular_Vendor_Stage_Change, {projectVendorPaymentStructureIDs, employeeID})
}

export function ModularAddonWorkOrderVendorStageChangeAPI(
  projectVendorPaymentStructureIDs: string,
  employeeID: number
) {
  return axios.post(Modular_Addon_WorkOrder_Vendor_Stage_Change, {
    projectVendorPaymentStructureIDs,
    employeeID,
  })
}
export function ModularOtherVenWorkOrderVendorStageChangeAPI(
  projectVendorPaymentStructureIDs: string,
  employeeID: number
) {
  return axios.post(Modular_Other_Vendor_WorkOrder_Vendor_Stage_Change, {
    projectVendorPaymentStructureIDs,
    employeeID,
  })
}

export function Get_StageList_For_DesignerBy_ProjectIDAPI(projectID: number) {
  return axios.post(Get_StageList_For_DesignerBy_ProjectID, {projectID})
}

export function Add_ProjectDesignStage_ChangeByDesignerAPI(
  //projectDesignStageMapID: number,
  projectID: number,
  designStageIDs: string,
  stageTitles: string,
  createBy: number,
  ipAddress: string
) {
  return axios.post(Add_ProjectDesignStage_ChangeByDesigner, {
    //projectDesignStageMapID,
    projectID,
    designStageIDs,
    stageTitles,
    createBy,
    ipAddress,
  })
}

export function Approve_ProjectDesignStage_ByDesignerAPI(
  projectDesignStageMapID: number,
  approveBy: number,
  ipAddress: string
) {
  return axios.post(Approve_ProjectDesignStage_ByDesigner, {
    projectDesignStageMapID,
    approveBy,
    ipAddress,
  })
}

export function Reject_ProjectDesignStage_ByDesignerAPI(
  projectDesignStageMapID: number,
  ipAddress: string
) {
  return axios.post(Reject_ProjectDesignStage_ByDM_Admin, {
    projectDesignStageMapID,
    ipAddress,
  })
}

export function DesignStageChangeReqListForDesignerListAPI() {
  return axios.get(DesignStageChangeReqListForDesigner)
}
