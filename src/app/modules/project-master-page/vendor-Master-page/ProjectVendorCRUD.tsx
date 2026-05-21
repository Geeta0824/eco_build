import axios from 'axios'
import {IAgencyTypeObjModel} from '../../../models/projects-page/IProjectVendorModel'
const BASE_API_URL = process.env.REACT_APP_API_URL
// =================Project Vendor URL=====================
export const GET_Project_Vendor_List = `${BASE_API_URL}/Project/GetProject_Vendor_List`
export const Add_Project_Vendor_Details = `${BASE_API_URL}/Project/AddProject_Vendor_Map`
export const Edit_Project_Vendor_Details = `${BASE_API_URL}/Project/UpdateProject_Vendor_Map`
export const GET_Project_Vendor_By_Project_Vendor_ID = `${BASE_API_URL}/Project/GetProjecVendorByProjecVendorID`
export const Delete_Project_Vendor_Data = `${BASE_API_URL}/Project/DeleteProjectVendorMap`
export const GET_Project_Vendor_Breakup_List = `${BASE_API_URL}/Project/GetProject_Vendor_BreackupList`
export const Delete_Project_PMC_Vendor_Map_Dtl_Data = `${BASE_API_URL}/Project/DeleteProjectVendorMapDtl`
export const Update_Project_Vendor_Breakup_DataAPI = `${BASE_API_URL}/Project/Update_Project_Vendor_Breackup`
export const Get_Agency_Type_By_VendorID = `${BASE_API_URL}/AgencyType/GetAgencyTypeByVendorID`
export const Get_AgencyBreakup_DIY_ProjectID = `${BASE_API_URL}/Project/Get_AgencyBreakup_DIY`
export const AddProject_Vendor_Map_MultipleAGency_DIY = `${BASE_API_URL}/Project/AddProject_Vendor_Map_MultipleAGency_DIY`

export const Add_Project_Vendor_Details_WithGST = `${BASE_API_URL}/Project/AddProject_Vendor_Map_WithGST`
export const Edit_Project_Vendor_Details_WithGST = `${BASE_API_URL}/Project/UpdateProject_Vendor_Map_WithGST`
export const GET_Project_Vendor_By_Project_Vendor_ID_WithGST = `${BASE_API_URL}/Project/GetProjecVendorByProjecVendorID_WithGST`
export const AddProject_Vendor_Map_MultipleAGency_WithGST_DIY = `${BASE_API_URL}/Project/AddProject_Vendor_Map_MultipleAGency_WithGST_DIY`
// =========================Post Project Vendor List=====================
export function getAgencyTypeByVendorIDApi(vendorID: number) {
  return axios.post(Get_Agency_Type_By_VendorID, {vendorID})
}

export function getAgencyTypeByProjectIDApi(projectID: number) {
  return axios.post(Get_AgencyBreakup_DIY_ProjectID, {projectID})
}

export function getProjectVendorBreakupListAPI(projectVendorID: number) {
  return axios.post(GET_Project_Vendor_Breakup_List, {projectVendorID})
}
export function getProjectVendorListAPI(projectID: number) {
  return axios.post(GET_Project_Vendor_List, {projectID})
}

export function UpdateProjectVendorBreakupDataAPI(
  projectPMCVendorMapDtl: number,
  projectVendorID: number,
  vendorCost: string,
  assignDate: string,
  workCompleteDate: string,
  remarks: string
) {
  return axios.post(Update_Project_Vendor_Breakup_DataAPI, {
    projectPMCVendorMapDtl,
    projectVendorID,
    vendorCost,
    assignDate,
    workCompleteDate,
    remarks,
  })
}

export function AddProjectVendorDetailsAPI(
  projectID: number,
  vendorID: number,
  assignDate: string,
  workCompleteDate: string,
  remarks: string,
  filePath: string,
  vendroCost: number,
  createBy: number,
  ipAddress: string,
  paidAmount: number,
  remainingAmount: number,
  agencyTypeID: number
) {
  return axios.post(Add_Project_Vendor_Details, {
    projectID,
    vendorID,
    assignDate,
    workCompleteDate,
    remarks,
    filePath,
    vendroCost,
    createBy,
    ipAddress,
    paidAmount,
    remainingAmount,
    agencyTypeID,
  })
}

export function getProjectVendorByVendorIdAPI(projectVendorID: number) {
  return axios.post(GET_Project_Vendor_By_Project_Vendor_ID, {projectVendorID})
}
export function EditProjectVendorDetailsAPI(
  projectVendorID: number,
  projectID: number,
  vendorID: number,
  assignDate: string,
  workCompleteDate: string,
  remarks: string,
  filePath: string,
  vendorCost: number,
  updateBy: number,
  ipAddress: string,
  paidAmount: number,
  remainingAmount: number,
  agencyTypeID: number
) {
  return axios.post(Edit_Project_Vendor_Details, {
    projectVendorID,
    projectID,
    vendorID,
    assignDate,
    workCompleteDate,
    remarks,
    filePath,
    vendorCost,
    updateBy,
    ipAddress,
    paidAmount,
    remainingAmount,
    agencyTypeID,
  })
}
export function DeleteProjectVendorDataAPI(projectVendorID: number) {
  return axios.post(Delete_Project_Vendor_Data, {projectVendorID})
}
export function deleteProjectPMCVendorMapDtlDataAPI(projectpmcvendormapdtlID: number) {
  return axios.post(Delete_Project_PMC_Vendor_Map_Dtl_Data, {projectpmcvendormapdtlID})
}

export function AddMultpleAgecyProjectVendorDetailsAPI(
  lstAgencyType: IAgencyTypeObjModel[],
  projectID: number,
  vendorID: number,
  assignDate: string,
  workCompleteDate: string,
  remarks: string,
  filePath: string,
  //vendroCost: number,
  createBy: number,
  ipAddress: string
  //paidAmount: number,
  //remainingAmount: number,
  //agencyTypeID: number
) {
  return axios.post(AddProject_Vendor_Map_MultipleAGency_DIY, {
    lstAgencyType,
    projectID,
    vendorID,
    assignDate,
    workCompleteDate,
    remarks,
    filePath,
    //vendroCost,
    createBy,
    ipAddress,
    //paidAmount,
    //remainingAmount,
    //agencyTypeID,
  })
}
// ----------------Project VendorMap With GST-------------------------------
export function editProjectVendorDetailsAPI_WithGST(
  projectVendorID: number,
  projectID: number,
  vendorID: number,
  assignDate: string,
  workCompleteDate: string,
  remarks: string,
  filePath: string,
  vendorCost: number,
  updateBy: number,
  ipAddress: string,
  paidAmount: number,
  remainingAmount: number,
  agencyTypeID: number,
  isGST: boolean,
  gstTypeID: number,
  cgstPer: number,
  cgstVal: number,
  sgstPer: number,
  sgstVal: number,
  igstPer: number,
  igstVal: number,
  gstAmount: number,
  afterGSTAmount: number,
  subTotal: number,
  finalAmount: number
) {
  return axios.post(Edit_Project_Vendor_Details_WithGST, {
    projectVendorID,
    projectID,
    vendorID,
    assignDate,
    workCompleteDate,
    remarks,
    filePath,
    vendorCost,
    updateBy,
    ipAddress,
    paidAmount,
    remainingAmount,
    agencyTypeID,
    isGST,
    gstTypeID,
    cgstPer,
    cgstVal,
    sgstPer,
    sgstVal,
    igstPer,
    igstVal,
    gstAmount,
    afterGSTAmount,
    subTotal,
    finalAmount,
  })
}

export function addProjectVendorDetails_WithGSTAPI(
  projectID: number,
  vendorID: number,
  assignDate: string,
  workCompleteDate: string,
  remarks: string,
  filePath: string,
  vendroCost: number,
  createBy: number,
  ipAddress: string,
  paidAmount: number,
  remainingAmount: number,
  agencyTypeID: number,
  isGST: boolean,
  gstTypeID: number,
  cgstPer: number,
  cgstVal: number,
  sgstPer: number,
  sgstVal: number,
  igstPer: number,
  igstVal: number,
  gstAmount: number,
  afterGSTAmount: number,
  subTotal: number,
  finalAmount: number
) {
  return axios.post(Add_Project_Vendor_Details_WithGST, {
    projectID,
    vendorID,
    assignDate,
    workCompleteDate,
    remarks,
    filePath,
    vendroCost,
    createBy,
    ipAddress,
    paidAmount,
    remainingAmount,
    agencyTypeID,
    isGST,
    gstTypeID,
    cgstPer,
    cgstVal,
    sgstPer,
    sgstVal,
    igstPer,
    igstVal,
    gstAmount,
    afterGSTAmount,
    subTotal,
    finalAmount,
  })
}

export function getProjectVendorByVendorId_WithGSTAPI(projectVendorID: number) {
  return axios.post(GET_Project_Vendor_By_Project_Vendor_ID_WithGST, {projectVendorID})
}

export function addMultpleAgecyProjectVendorDetails_WithGSTAPI(
  lstAgencyType: IAgencyTypeObjModel[],
  projectID: number,
  vendorID: number,
  assignDate: string,
  workCompleteDate: string,
  remarks: string,
  filePath: string,
  isGST: boolean,
  gstTypeID: number,
  cgstPer: number,
  cgstVal: number,
  sgstPer: number,
  sgstVal: number,
  igstPer: number,
  igstVal: number,
  gstAmount: number,
  afterGSTAmount: number,
  subTotal: number,
  finalAmount: number,
  //vendroCost: number,
  createBy: number,
  ipAddress: string
  //paidAmount: number,
  //remainingAmount: number,
  //agencyTypeID: number
) {
  return axios.post(AddProject_Vendor_Map_MultipleAGency_WithGST_DIY, {
    lstAgencyType,
    projectID,
    vendorID,
    assignDate,
    workCompleteDate,
    remarks,
    filePath,
    isGST,
    gstTypeID,
    cgstPer,
    cgstVal,
    sgstPer,
    sgstVal,
    igstPer,
    igstVal,
    gstAmount,
    afterGSTAmount,
    subTotal,
    finalAmount,
    //vendroCost,
    createBy,
    ipAddress,
    //paidAmount,
    //remainingAmount,
    //agencyTypeID,
  })
}