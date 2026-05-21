import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL
// ----------------- PMC Assign Request ---------------------
export const Req_ProjectID_With_VendorID = `${BASE_API_URL}/Project/Req_ProjectID_With_VendorID` //Get  PMC Assign Request
export const Get_Project_Request_List_To_PMC = `${BASE_API_URL}/Project/GetProjectRequest_ListToPMC` //Get  PMC Assign Request BY ID
export const Add_Project_Vendor_Map = `${BASE_API_URL}/Project/AddProject_Vendor_Map` //Add Project Accept
export const PMC_Assign_Req_Response_By_Admin = `${BASE_API_URL}/Project/PMC_Assign_Req_Response_By_Admin` //Add Project Accept

// ======================Get Designation=============================

export function Req_ProjectID_With_VendorIDApi(
  projectID: number,
  vendorIDs: string,
  requestBy: number,
  requestStatus: string,
  projectCost: number,
  statusID: string,
  createBy: number,
  ipAddress: string
) {
  return axios.post(Req_ProjectID_With_VendorID, {
    projectID,
    vendorIDs,
    requestBy,
    requestStatus,
    projectCost,
    statusID,
    createBy,
    ipAddress,
  })
}

// ======================Get Vendor By VendorTypeID=============================
export function getProjectRequestListToPMC(projectID: number) {
  return axios.post(Get_Project_Request_List_To_PMC, {projectID})
}

// /--------------------Add Project Accept--------------
export function AddProjectVendorMapApi(
  projectID: number,
  vendorID: number,
  assignDate: string,
  remarks: string,
  filePath: string,
  vendroCost: number,
  paidAmount: number,
  remainingAmount: number,
  createBy: number,
  ipAddress: string
) {
  return axios.post(Add_Project_Vendor_Map, {
    projectID,
    vendorID,
    assignDate,
    remarks,
    filePath,
    vendroCost,
    paidAmount,
    remainingAmount,
    createBy,
    ipAddress,
  })
}

// /--------------------Add Project Accept--------------
export function PMC_Assign_Req_Response_By_AdminApi(
  projectID: number,
  vendorID: number,
  assignDate: string,
  remarks: string,
  filePath: string,
  vendroCost: number,
  paidAmount: number,
  remainingAmount: number,
  createBy: number,
  ipAddress: string
) {
  return axios.post(PMC_Assign_Req_Response_By_Admin, {
    projectID,
    vendorID,
    assignDate,
    remarks,
    filePath,
    vendroCost,
    paidAmount,
    remainingAmount,
    createBy,
    ipAddress,
  })
}
