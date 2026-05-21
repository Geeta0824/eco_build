import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL
//=====================New Customer URL======================
export const GET_ALL_BRANCH = `${BASE_API_URL}/Branch_New/GetBranchWebList`
export const DELETE_BRANCH = `${BASE_API_URL}/Branch_New/PostDeleteBranch`
export const ISACTIVE_BRANCH = `${BASE_API_URL}/Branch_New/UpdateBranchIsactive`
export const ADD_BRANCH = `${BASE_API_URL}/Branch_New/AddBranchDetails`
export const UPDATE_BRANCH = `${BASE_API_URL}/Branch_New/UpdateBranchDetails`
export const GET_BRANCH_BY_BRANCH_ID = `${BASE_API_URL}/Branch_New/GetBranchByBranchID`
export const GET_BRANCH_DROPDOWN_LIST = `${BASE_API_URL}/Branch_New/GetBranchDropdownList` // Branch DropdownList Api
export const Add_Update_Branch_Rate = `${BASE_API_URL}/BranchRate/AddUpdateBranchRate` // Branch DropdownList Api
export const Get_BranchRate_By_BranchID = `${BASE_API_URL}/BranchRate/GetBranchRate_ByBranchID` // Branch DropdownList Api
export const Get_BranchRate_Map_List = `${BASE_API_URL}/BranchRate/GetBranchRateMap_List` // Branch DropdownList Api
export const GetDNC_BranchRate_Map_List = `${BASE_API_URL}/BranchRate/GetDNC_BranchRateMapList` // Branch DropdownList Api
export const GetModular_BranchRate_Map_List = `${BASE_API_URL}/BranchRate/GetModular_BranchRateMapList` // Branch DropdownList Api

export function getBranchDropdownList() {
  return axios.get(GET_BRANCH_DROPDOWN_LIST)
}

export function getBranchList() {
  return axios.get(GET_ALL_BRANCH)
}
export function deleteBranch(encodedReq: string) {
  return axios.post(DELETE_BRANCH, {encodedReq})
}
export function isActiveBranch(encodedReq: string) {
  return axios.post(ISACTIVE_BRANCH, {encodedReq})
}
export function addBranch(encodedReq: string) {
  return axios.post(ADD_BRANCH, {
    encodedReq,
  })
}
export function updateBranch(encodedReq: string) {
  return axios.post(UPDATE_BRANCH, {
    encodedReq,
  })
}

export function getBranchByBranchID(encodedReq: string) {
  return axios.post(GET_BRANCH_BY_BRANCH_ID, {encodedReq})
}
export function AddUpdateBranchRate(
  BranchRateID: number,
  BranchID: number,
  ReadyMadePercentage: number,
  DIYPercentage: number,
  ModularPercentage: number,
  DNCPercentage: number,
  Create_Update_By: number,
  IPAddress: string
) {
  return axios.post(Add_Update_Branch_Rate, {
    BranchRateID,
    BranchID,
    ReadyMadePercentage,
    DIYPercentage,
    ModularPercentage,
    DNCPercentage,
    Create_Update_By,
    IPAddress,
  })
}
export function GetBranchRate_ByBranchID(BranchID: number) {
  return axios.post(Get_BranchRate_By_BranchID, {
    BranchID,
  })
}
export function GetBranchRateMap_List() {
  return axios.get(Get_BranchRate_Map_List)
}
export function GetDNC_BranchRateMapList() {
  return axios.get(GetDNC_BranchRate_Map_List)
}
export function GetModular_BranchRateMapList() {
  return axios.get(GetModular_BranchRate_Map_List)
}

//=====================Customer URL======================
// export const GET_ALL_BRANCH = `${BASE_API_URL}/Branch/GetBranchWebList`
// export const DELETE_BRANCH = `${BASE_API_URL}/Branch/PostDeleteBranch`
// export const ISACTIVE_BRANCH = `${BASE_API_URL}/Branch/UpdateBranchIsactive`
// export const ADD_BRANCH = `${BASE_API_URL}/Branch/AddBranchDetails`
// export const UPDATE_BRANCH = `${BASE_API_URL}/Branch/UpdateBranchDetails`
// export const GET_BRANCH_BY_BRANCH_ID = `${BASE_API_URL}/Branch/GetBranchByBranchID`
// export const GET_BRANCH_DROPDOWN_LIST = `${BASE_API_URL}/Branch/GetBranchDropdownList` // Branch DropdownList Api

// export function getBranchDropdownList() {
//   return axios.get(GET_BRANCH_DROPDOWN_LIST)
// }

// export function getBranchList() {
//   return axios.get(GET_ALL_BRANCH)
// }
// export function deleteBranch(branchID: number) {
//   return axios.post(DELETE_BRANCH, {branchID})
// }
// export function isActiveBranch(branchID: number, isActive: boolean) {
//   return axios.post(ISACTIVE_BRANCH, {branchID, isActive})
// }
// export function addBranch(
//   branchName: string,
//   branchCode: string,
//   contactPerson: string,
//   cotactDesignation: number,
//   mobileNumber: string,
//   phoneNumber: string,
//   faxNumber: string,
//   email: string,
//   address1: string,
//   address2: string,
//   countryID: number,
//   stateID: number,
//   districtID: number,
//   talukaID: number,
//   pincode: string,
//   cityName: string,
//   isActive: boolean,
//   createBy: number,
//   ipAddress: string
// ) {
//   return axios.post(ADD_BRANCH, {
//     branchName,
//     branchCode,
//     contactPerson,
//     cotactDesignation,
//     mobileNumber,
//     phoneNumber,
//     faxNumber,
//     email,
//     address1,
//     address2,
//     countryID,
//     stateID,
//     districtID,
//     talukaID,
//     pincode,
//     cityName,
//     isActive,
//     createBy,
//     ipAddress,
//   })
// }
// export function updateBranch(
//   branchID: number,
//   branchName: string,
//   branchCode: string,
//   contactPerson: string,
//   cotactDesignation: number,
//   mobileNumber: string,
//   phoneNumber: string,
//   faxNumber: string,
//   email: string,
//   address1: string,
//   address2: string,
//   countryID: number,
//   stateID: number,
//   districtID: number,
//   talukaID: number,
//   pincode: string,
//   cityName: string,
//   isActive: boolean,
//   createBy: number,
//   ipAddress: string
// ) {
//   return axios.post(UPDATE_BRANCH, {
//     branchID,
//     branchName,
//     branchCode,
//     contactPerson,
//     cotactDesignation,
//     mobileNumber,
//     phoneNumber,
//     faxNumber,
//     email,
//     address1,
//     address2,
//     countryID,
//     stateID,
//     districtID,
//     talukaID,
//     pincode,
//     cityName,
//     isActive,
//     createBy,
//     ipAddress,
//   })
// }

// export function getBranchByBranchID(branchID: number) {
//   return axios.post(GET_BRANCH_BY_BRANCH_ID, {branchID})
// }
