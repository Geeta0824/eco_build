import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL
// =================Department URL=====================
export const GET_ALL_Vendor_Reduction_List = `${BASE_API_URL}/ProjectReduction/GetProjectVendorReductionListByProjectVendorID`
export const Add_Vendor_Reduction_Details = `${BASE_API_URL}/ProjectReduction/AddProjectVendorReductionDetails`
export const Edit_Vendor_Reduction_Details = `${BASE_API_URL}/ProjectReduction/UpdateProjectVendorReductionDetails`
export const GET_Vendor_Reduction_By_Vendor_Reduction_ID = `${BASE_API_URL}/ProjectReduction/GetProjectVendorReductionListByProjectVendorReductionID`
export const Delete_Vendor_Reduction_Data = `${BASE_API_URL}/ProjectReduction/DeleteProjectVendorReductionDetails`

// =========================Get VendorStatus_List=====================
export function getAllVendorReductionListAPI(projectVendorID: number) {
  return axios.post(GET_ALL_Vendor_Reduction_List, {projectVendorID})
}

export function AddVendorReductionDetailsAPI(
  projectID: number,
  vendorID: number,
  projectVendorID: number,
  remarks: string,
  reductionCost: number,
  reductionDate: string,
  createBy: number,
  ipAddress: string
) {
  return axios.post(Add_Vendor_Reduction_Details, {
    projectID,
    vendorID,
    projectVendorID,
    remarks,
    reductionCost,
    reductionDate,
    createBy,
    ipAddress,
  })
}
export function getVendorReductionByVendorReductionIdAPI(projectVendorReductionID: number) {
  return axios.post(GET_Vendor_Reduction_By_Vendor_Reduction_ID, {projectVendorReductionID})
}
export function EditVendorReductionDetailsAPI(
  projectVendorReductionID: number,
  projectID: number,
  vendorID: number,
  projectVendorID: number,
  remarks: string,
  reductionCost: number,
  reductionDate: string,
  updateBy: number,
  ipAddress: string
) {
  return axios.post(Edit_Vendor_Reduction_Details, {
    projectVendorReductionID,
    projectID,
    vendorID,
    projectVendorID,
    remarks,
    reductionCost,
    reductionDate,
    updateBy,
    ipAddress,
  })
}
export function deleteVendorReductionDataAPI(projectVendorReductionID: number) {
  return axios.post(Delete_Vendor_Reduction_Data, {projectVendorReductionID})
}
