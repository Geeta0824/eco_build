import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL
// =================Kyc Document URL=====================
export const GET_OFFER_LIST = `${BASE_API_URL}/Offer/GetOfferList`
export const Get_Offer_List_By_BranchID = `${BASE_API_URL}/Offer/GetOfferListByBranchID`
export const ADD_OFFER_DETAILS = `${BASE_API_URL}/Offer/AddOfferDetails`
export const UPDATE_OFFER_DETAILS = `${BASE_API_URL}/Offer/UpdateOfferDetails`
export const GET_OFFER_BY_OFFER_ID = `${BASE_API_URL}/Offer/GetOfferByOfferID`
export const DELETE_OFFER_DETAILS = `${BASE_API_URL}/Offer/DeleteOffer`
export const Get_Branch_With_OfferID = `${BASE_API_URL}/Offer/GetBranchWithOfferID`
export const Add_Branch_By_OfferID = `${BASE_API_URL}/Offer/AddBranchByOfferID`
// export const Offer_ISACTIVE = `${BASE_API_URL}/Offer/UpdateOfferApiIsactive`

export function getOfferListApi() {
  return axios.get(GET_OFFER_LIST)
}

export function getOfferListByBranchIDAPI(branchID: number) {
  return axios.post(Get_Offer_List_By_BranchID, {branchID})
}

export function addOfferApi(
  offerTitle: string,
  offerDesc: string,
  createBy: number,
  ipAddress: string,
  offerPercentage: number,
  isPriceEffect: boolean
) {
  return axios.post(ADD_OFFER_DETAILS, {
    offerTitle,
    offerDesc,
    createBy,
    ipAddress,
    offerPercentage,
    isPriceEffect,
  })
}

export function updateOfferApi(
  offerID: number,
  offerTitle: string,
  offerDesc: string,
  createBy: number,
  ipAddress: string,
  offerPercentage: number,
  isPriceEffect: boolean
) {
  return axios.post(UPDATE_OFFER_DETAILS, {
    offerID,
    offerTitle,
    offerDesc,
    createBy,
    ipAddress,
    offerPercentage,
    isPriceEffect,
  })
}

export function getOfferByOfferIDApi(offerID: number) {
  return axios.post(GET_OFFER_BY_OFFER_ID, {offerID})
}

export function deleteOfferDataApi(offerID: number) {
  return axios.post(DELETE_OFFER_DETAILS, {offerID})
}

// export function isActiveOfferApiData(offerID: number, isActive: boolean) {
//   return axios.post(Offer_ISACTIVE, {offerID, isActive})
// }

export function GetBranchByOfferIDApi(offerID: number) {
  return axios.post(Get_Branch_With_OfferID, {offerID})
}
export function AddBranchByOfferIDAPI(branchIDs: string, offerID: number) {
  return axios.post(Add_Branch_By_OfferID, {branchIDs, offerID})
}
