import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL
// =================Department URL=====================
export const GET_ALL_Project_Invoice_List = `${BASE_API_URL}/ProjectInvoice/GetProjectInvoiceListByProjectID`
export const Add_Project_Invoice_Details = `${BASE_API_URL}/ProjectInvoice/AddProjectInvoiceDetails`
export const Update_Project_Invoice_Details = `${BASE_API_URL}/ProjectInvoice/UpdateProjectInvoiceDetails`
export const GET_Project_Invoice_By_Project_Invoice_ID = `${BASE_API_URL}/ProjectInvoice/GetProjectInvoiceByProjectInvoiceID`
export const Delete_Project_Invoice_Data = `${BASE_API_URL}/ProjectInvoice/DeleteProjectProjectInvoice`

// =========================Get ProjectStatus_List=====================
export function getAllProjectInvoiceListAPI(projectID:number) {
  return axios.post(GET_ALL_Project_Invoice_List,{projectID})
}

export function addProjectInvoiceDetailsAPI(
  projectID: number,
  projectAmount: number,
  gstTypeID: number,
  sgstPer: number,
  cgstPer: number,
  sgstVal: number,
  cgstVal: number,
  igstPer: number,
  igstVal: number,
  isgst: boolean,
  isPaymentReceive: boolean,
  invDesc: string,
  createBy: number,
  ipAddress: string
) {
  return axios.post(Add_Project_Invoice_Details, {
    projectID,
    projectAmount,
    gstTypeID,
    sgstPer,
    cgstPer,
    sgstVal,
    cgstVal,
    igstPer,
    igstVal,
    isgst,
    isPaymentReceive,
    invDesc,
    createBy,
    ipAddress,
  })
}
export function getProjectInvoiceByProjectInvoiceIdAPI(projectInvoiceID: number) {
  return axios.post(GET_Project_Invoice_By_Project_Invoice_ID, {projectInvoiceID})
}
export function updateProjectInvoiceDetailsAPI(
  projectInvoiceID: number,
  projectID: number,
  projectAmount: number,
  gstTypeID: number,
  sgstPer: number,
  cgstPer: number,
  sgstVal: number,
  cgstVal: number,
  igstPer: number,
  igstVal: number,
  gstAmount: number,
  totalAmount: number,
  isgst: boolean,
  isPaymentReceive: boolean,
  invDesc: string,
  updateBy: number,
  ipAddress: string
) {
  return axios.post(Update_Project_Invoice_Details, {
    projectInvoiceID,
    projectID,
    projectAmount,
    gstTypeID,
    sgstPer,
    cgstPer,
    sgstVal,
    cgstVal,
    igstPer,
    igstVal,
    gstAmount,
    totalAmount,
    isgst,
    isPaymentReceive,
    invDesc,
    updateBy,
    ipAddress,
  })
}
export function deleteProjectInvoiceDataAPI(projectInvoiceID: number) {
  return axios.post(Delete_Project_Invoice_Data, {projectInvoiceID})
}
