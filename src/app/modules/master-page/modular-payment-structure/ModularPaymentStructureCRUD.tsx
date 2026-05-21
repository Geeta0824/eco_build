import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL
//=====================Modular URL======================
export const GET_ALL_Modular_PROJ_PAY_STRUCTURE = `${BASE_API_URL}/ModularPaymentStructure/GetModularProjectPaymentStructureWebList` //Get Country Page
export const POST_ALL_Modular_PROJ_PAY_STRUCTURE = `${BASE_API_URL}/ModularPaymentStructure/AddModularProjectPaymentStructureDetails` //Create Country Page
export const Modular_PROJ_PAY_STRUCTURE_DATA_BY_Modular_PROJ_PAYMENT_STAGE_ID = `${BASE_API_URL}/ModularPaymentStructure/GetModularProjectPaymentStructureByjPaymentStageID` //Update Country Page
export const UPDATE_Modular_PROJ_PAY_STRUCTURE = `${BASE_API_URL}/ModularPaymentStructure/UpdateModularProjectPaymentStructureDetails` //Update Country Page
export const DELETE_Modular_PROJ_PAY_STRUCTURE = `${BASE_API_URL}/ModularPaymentStructure/PostDeleteModularProjectPaymentStructure` //Delete Country Page
export const Add_BranchBy_Modular_Payment_StageID = `${BASE_API_URL}/ModularPaymentStructure/AddBranchByModularPaymentStageID` //Export excel
export const Get_Branch_With_Modular_Payment_StageID = `${BASE_API_URL}/ModularPaymentStructure/GetBranchWithModularPaymentStageID` //Export excel

// -----------------------Turnkey Map Branch-----------
export function addBranchByModularPaymentStageApi(
  modularPaymentStructureID: number,
  branchIDs: string
) {
  return axios.post(Add_BranchBy_Modular_Payment_StageID, {modularPaymentStructureID, branchIDs})
}
export function getBranchWithModularPaymentStageIDApi(dncProjPaymentStageID: number) {
  return axios.post(Get_Branch_With_Modular_Payment_StageID, {dncProjPaymentStageID})
}
// ========= GET Modular PROJECT PAYMENT STRUCTURE =================================
export function getAllModularProjPayStructureAPI() {
  return axios.get(GET_ALL_Modular_PROJ_PAY_STRUCTURE)
}
// ===================== CREATE Modular PROJECT PAYMENT STRUCTURE ===================
export function createAllModularProjPayStructureAPI(
  sequenceNo: number,
  noOfDays: string,
  stageName: string,
  amtPercentage: number,
  createBy: number,
  ipAddress: string
) {
  return axios.post(POST_ALL_Modular_PROJ_PAY_STRUCTURE, {
    sequenceNo,
    noOfDays,
    stageName,
    amtPercentage,
    createBy,
    ipAddress,
  })
}
// =======================UPDATE Modular PROJECT PAYMENT STRUCTURE==================
export function getModProjPayStrDataByModProjPayStageIdAPI(dncProjPaymentStageID: number) {
  return axios.post(Modular_PROJ_PAY_STRUCTURE_DATA_BY_Modular_PROJ_PAYMENT_STAGE_ID, {
    dncProjPaymentStageID,
  })
}

// ======================================================
export function updateModularProjPayStructureAPI(
  dncProjPaymentStageID: number,
  sequenceNo: number,
  noOfDays: string,
  stageName: string,
  amtPercentage: number,
  updateBy: number,
  ipAddress: string
) {
  return axios.post(UPDATE_Modular_PROJ_PAY_STRUCTURE, {
    dncProjPaymentStageID,
    sequenceNo,
    noOfDays,
    stageName,
    amtPercentage,
    updateBy,
    ipAddress,
  })
}
// ======================= DELETE Modular PROJECT PAYMENT STRUCTURE ==================
export function deleteModularProjPayStructureAPI(dncProjPaymentStageID: number) {
  return axios.post(DELETE_Modular_PROJ_PAY_STRUCTURE, {dncProjPaymentStageID})
}
