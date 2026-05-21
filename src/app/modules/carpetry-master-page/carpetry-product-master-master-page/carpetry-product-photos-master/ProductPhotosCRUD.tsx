import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL
//=====================Quotation Remarks URL======================
export const GET_ALL_Turnkey_Product_Image = `${BASE_API_URL}/TurnkeyProductImageMap/GetTurnkeyProductImageMapList` //Get Quotation Remarks Page
export const ADD_ALL_Turnkey_Product_Image = `${BASE_API_URL}/TurnkeyProductImageMap/AddTurnkeyProductImageMapDetails` //Create Quotation Remarks Page
export const Turnkey_Product_Image_DATA_BY_Turnkey_Product_Image_ID = `${BASE_API_URL}/TurnkeyProductImageMap/GetTurnkeyProductImageByTurnkeyProductImageID` //Update Quotation Remarks Page
export const UPDATE_Turnkey_Product_Image = `${BASE_API_URL}/TurnkeyProductImageMap/UpdateTurnkeyProductImageMapDetails` //Update Quotation Remarks Page
export const DELETE_Turnkey_Product_Image = `${BASE_API_URL}/TurnkeyProductImageMap/DeleteTurnkeyProductImageByID` //Delete Quotation Remarks Page

// ========= GET Quotation Remarks =================================
export function getAllTurnkeyProductImageApi(productID: number) {
  return axios.post(GET_ALL_Turnkey_Product_Image, {productID})
}
// ===================== CREATE Quotation Remarks ===================
export function addTurnkeyProductImageApi(
  productID: number,
  projectTypeID: number,
  filePath: string,
  createBy: number,
  ipAddress: string
) {
  return axios.post(ADD_ALL_Turnkey_Product_Image, {
    productID,
    projectTypeID,
    filePath,
    createBy,
    ipAddress,
  })
}
// =======================UPDATE Quotation Remarks==================
export function getProductImageDataByProductImageID(turnkeyProductImageID: number) {
  return axios.post(Turnkey_Product_Image_DATA_BY_Turnkey_Product_Image_ID, {
    turnkeyProductImageID,
  })
}

// ======================================================
export function updateTurnkeyProductImageApi(
  turnkeyProductImageID: number,
  productID: number,
  projectTypeID: number,
  filePath: string,
  updateBy: number,
  ipAddress: string
) {
  return axios.post(UPDATE_Turnkey_Product_Image, {
    turnkeyProductImageID,
    productID,
    projectTypeID,
    filePath,
    updateBy,
    ipAddress,
  })
}
// =======================DELETE Quotation Remarks==================
export function deleteTurnkeyProductImageApi(turnkeyProductImageID: number) {
  return axios.post(DELETE_Turnkey_Product_Image, {turnkeyProductImageID})
}
