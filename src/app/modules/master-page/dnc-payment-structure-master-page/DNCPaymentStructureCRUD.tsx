import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL
//=====================DNC URL======================
export const GET_ALL_DNC_PROJ_PAY_STRUCTURE = `${BASE_API_URL}/DNCProjectPaymentStructure/GetDNCProjectPaymentStructureWebList` //Get Country Page
export const POST_ALL_DNC_PROJ_PAY_STRUCTURE = `${BASE_API_URL}/DNCProjectPaymentStructure/AddDNCProjectPaymentStructureDetails` //Create Country Page
export const DNC_PROJ_PAY_STRUCTURE_DATA_BY_DNC_PROJ_PAYMENT_STAGE_ID = `${BASE_API_URL}/DNCProjectPaymentStructure/GetDNCProjectPaymentStructureByDNCProjPaymentStageID` //Update Country Page
export const UPDATE_DNC_PROJ_PAY_STRUCTURE = `${BASE_API_URL}/DNCProjectPaymentStructure/UpdateDNCProjectPaymentStructureDetails` //Update Country Page
export const DELETE_DNC_PROJ_PAY_STRUCTURE = `${BASE_API_URL}/DNCProjectPaymentStructure/PostDeleteDNCProjectPaymentStructure` //Delete Country Page
export const Add_BranchBy_DNC_Payment_StageID = `${BASE_API_URL}/DNCProjectPaymentStructure/AddBranchByDNCPaymentStageID` //Export excel
export const Get_Branch_With_DNC_Payment_StageID = `${BASE_API_URL}/DNCProjectPaymentStructure/GetBranchWithDNCPaymentStageID` //Export excel

// -----------------------Turnkey Map Branch-----------
export function addBranchByDNCPaymentStageApi(
  dncProjPaymentStageID: number,
  branchIDs: string
) {
  return axios.post(Add_BranchBy_DNC_Payment_StageID, {dncProjPaymentStageID, branchIDs})
}
export function getBranchWithDNCPaymentStageIDApi(dncProjPaymentStageID: number) {
  return axios.post(Get_Branch_With_DNC_Payment_StageID, {dncProjPaymentStageID})
}

// ========= GET DNC PROJECT PAYMENT STRUCTURE =================================
export function getAllDNCProjPayStructureAPI() {
  return axios.get(GET_ALL_DNC_PROJ_PAY_STRUCTURE)
}
// ===================== CREATE DNC PROJECT PAYMENT STRUCTURE ===================
export function postAllDNCProjPayStructureAPI(
  sequenceNo: number,
  noOfDays: string,
  stageName: string,
  amtPercentage: number,
  createBy: number,
  ipAddress: string
) {
  return axios.post(POST_ALL_DNC_PROJ_PAY_STRUCTURE, {
    sequenceNo,
    noOfDays,
    stageName,
    amtPercentage,
    createBy,
    ipAddress
  })
}
// =======================UPDATE DNC PROJECT PAYMENT STRUCTURE==================
export function getDNCProjPayStructureDataByDNCProjPaymentStageIdAPI(dncProjPaymentStageID: number) {
  return axios.post(DNC_PROJ_PAY_STRUCTURE_DATA_BY_DNC_PROJ_PAYMENT_STAGE_ID, { dncProjPaymentStageID })
}

// ======================================================
export function updateDNCProjPayStructureAPI(
  dncProjPaymentStageID: number,
  sequenceNo: number,
  noOfDays: string,
  stageName: string,
  amtPercentage: number,
  updateBy: number,
  ipAddress: string
) {
  return axios.post(UPDATE_DNC_PROJ_PAY_STRUCTURE, {
    dncProjPaymentStageID,
    sequenceNo,
    noOfDays,
    stageName,
    amtPercentage,
    updateBy,
    ipAddress,
  })
}
// ======================= DELETE DNC PROJECT PAYMENT STRUCTURE ==================
export function deleteDNCProjPayStructureAPI(dncProjPaymentStageID: number) {
  return axios.post(DELETE_DNC_PROJ_PAY_STRUCTURE, { dncProjPaymentStageID })
}
