import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL
//=====================TURNKEY URL======================
export const GET_ALL_TURNKEY_PROJ_PAY_STRUCTURE = `${BASE_API_URL}/TurnkeyProjectPaymentStructure/GetTurnkeyProjectPaymentStructureWebList` //Get Country Page
export const POST_ALL_TURNKEY_PROJ_PAY_STRUCTURE = `${BASE_API_URL}/TurnkeyProjectPaymentStructure/AddTurnkeyProjectPaymentStructureDetails` //Create Country Page
export const TURNKEY_PROJ_PAY_STRUCTURE_DATA_BY_TURNKEY_PROJ_PAYMENT_STAGE_ID = `${BASE_API_URL}/TurnkeyProjectPaymentStructure/GetTurnkeyProjectPaymentStructureByTurnkeyProjPaymentStageID` //Update Country Page
export const UPDATE_TURNKEY_PROJ_PAY_STRUCTURE = `${BASE_API_URL}/TurnkeyProjectPaymentStructure/UpdateTurnkeyProjectPaymentStructureDetails` //Update Country Page
export const DELETE_TURNKEY_PROJ_PAY_STRUCTURE = `${BASE_API_URL}/TurnkeyProjectPaymentStructure/PostDeleteTurnkeyProjectPaymentStructure` //Delete Country Page
export const Add_BranchBy_Turnkey_Proj_Payment_StageID = `${BASE_API_URL}/TurnkeyProjectPaymentStructure/AddBranchByTurnkeyProjPaymentStageID` //Export excel
export const Get_Branch_With_Turnkey_Payment_StageID = `${BASE_API_URL}/TurnkeyProjectPaymentStructure/GetBranchWithTurnkeyPaymentPaymentStageID` //Export excel

// -----------------------Turnkey Map Branch-----------
export function addBranchByTurnkeyProjPaymentStageApi(
  turnkeyProjPaymentStageID: number,
  quotationTypeID: number,
  branchIDs: string
) {
  return axios.post(Add_BranchBy_Turnkey_Proj_Payment_StageID, {
    turnkeyProjPaymentStageID,
    quotationTypeID,
    branchIDs,
  })
}
export function getBranchWithTurnkeyPaymentStageIDApi(turnkeyProjPaymentStageID: number) {
  return axios.post(Get_Branch_With_Turnkey_Payment_StageID, {turnkeyProjPaymentStageID})
}

// ========= GET TURNKEY PROJECT PAYMENT STRUCTURE =================================
export function getAllTurnkeyProjPayStructure() {
  return axios.get(GET_ALL_TURNKEY_PROJ_PAY_STRUCTURE)
}
// ===================== CREATE TURNKEY PROJECT PAYMENT STRUCTURE ===================
export function postTurnkeyProjPayStructure(
  projectTypeID: number,
  sequenceNo: number,
  noOfDays: string,
  stageName: string,
  amtPercentage: number,
  createBy: number,
  ipAddress: string
) {
  return axios.post(POST_ALL_TURNKEY_PROJ_PAY_STRUCTURE, {
    projectTypeID,
    sequenceNo,
    noOfDays,
    stageName,
    amtPercentage,
    createBy,
    ipAddress,
  })
}
// =======================UPDATE TURNKEY PROJECT PAYMENT STRUCTURE==================
export function getTurnkeyProjPayStructureDataByTurnkeyProjPaymentStageID(
  turnkeyProjPaymentStageID: number
) {
  return axios.post(TURNKEY_PROJ_PAY_STRUCTURE_DATA_BY_TURNKEY_PROJ_PAYMENT_STAGE_ID, {
    turnkeyProjPaymentStageID,
  })
}

// ======================================================
export function updateTurnkeyProjPayStructure(
  turnkeyProjPaymentStageID: number,
  projectTypeID: number,
  sequenceNo: number,
  noOfDays: string,
  stageName: string,
  amtPercentage: number,
  updateBy: number,
  ipAddress: string
) {
  return axios.post(UPDATE_TURNKEY_PROJ_PAY_STRUCTURE, {
    turnkeyProjPaymentStageID,
    projectTypeID,
    sequenceNo,
    noOfDays,
    stageName,
    amtPercentage,
    updateBy,
    ipAddress,
  })
}
// =======================DELETE TURNKEY PROJECT PAYMENT STRUCTURE==================
export function deleteTurnkeyProjPayStructure(turnkeyProjPaymentStageID: number) {
  return axios.post(DELETE_TURNKEY_PROJ_PAY_STRUCTURE, {turnkeyProjPaymentStageID})
}
