import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL

export const Get_Work_Order_Request_List = `${BASE_API_URL}/WorkOrderRequest/GetWorkOrderRequestList` //list
export const Add_Work_Order_Request_Vendor = `${BASE_API_URL}/WorkOrderRequest/AddWorkOrderRequest_Vendor` //add
export const Add_Work_Order_Request_PMC = `${BASE_API_URL}/WorkOrderRequest/AddWorkOrderRequest_PMC` //add
export const GetPMCStageList_ByProjectID = `${BASE_API_URL}/WorkOrderRequest/GetPMCStageList_ByProjectID` //dropDown
export const Approve_Work_Order_Request = `${BASE_API_URL}/WorkOrderRequest/Approve_WorkOrderRequest` //Approve
export const GetWorkOrder_ListBy_WorkOrderRequestID = `${BASE_API_URL}/WorkOrderRequest/GetWorkOrderListByWorkOrderRequestID`
export const WorkOrderRequest_PMC_Update = `${BASE_API_URL}/WorkOrderRequest/WorkOrderRequest_PMC_Update`
export const WorkOrderRequest_Vendor_Update = `${BASE_API_URL}/WorkOrderRequest/WorkOrderRequest_Vendor_Update`
export const Delete_WorkOrderRequest_ByID = `${BASE_API_URL}/WorkOrderRequest/PostDeleteWorkOrderRequest`

//dropdown
export function GetWorkOrderRequestListAPI(employeeID: number) {
  return axios.post(Get_Work_Order_Request_List, {employeeID})
}

//dropdown
export function GetPMCStageList_ByProjectIDApi(projectID: number) {
  return axios.post(GetPMCStageList_ByProjectID, {projectID})
}

//add
export function AddWorkOrderRequestListAPI(
  assignDate: string,
  projectID: number,
  vendorID: number,
  vendorTypeID: string,
  description: string,
  filePath: string,
  amount: number,
  workCompleteDate: string,
  createBy: number,
  ipAddress: string
) {
  return axios.post(Add_Work_Order_Request_Vendor, {
    assignDate,
    projectID,
    vendorID,
    vendorTypeID,
    description,
    filePath,
    amount,
    workCompleteDate,
    createBy,
    ipAddress,
  })
}

//add
export function AddWorkOrderRequestList_PMC_API(
  assignDate: string,
  projectID: number,
  vendorID: number,
  vendorTypeID: string,
  workStageID: number,
  description: string,
  filePath: string,
  amount: number,
  workCompleteDate: string,
  createBy: number,
  ipAddress: string
) {
  return axios.post(Add_Work_Order_Request_PMC, {
    assignDate,
    projectID,
    vendorID,
    vendorTypeID,
    workStageID,
    description,
    filePath,
    amount,
    workCompleteDate,
    createBy,
    ipAddress,
  })
}

export function ApproveWorkOrderRequestApi(
  workOrderRequestID: number,
  approveByID: number,
  workStageID: number
) {
  return axios.post(Approve_Work_Order_Request, {
    workOrderRequestID,
    approveByID,
    workStageID,
  })
}

// Get By ID
export function GetWorkOrderListByWorkOrderRequestIDApi(workOrderRequestID: number) {
  return axios.post(GetWorkOrder_ListBy_WorkOrderRequestID, {workOrderRequestID})
}

//Update
export function UpdateWorkOrderRequestListAPI(
  workOrderRequestID: number,
  assignDate: string,
  projectID: number,
  vendorID: number,
  vendorTypeID: string,
  description: string,
  filePath: string,
  amount: number,
  workCompleteDate: string,
  updateBy: number,
  ipAddress: string
) {
  return axios.post(WorkOrderRequest_Vendor_Update, {
    workOrderRequestID,
    assignDate,
    projectID,
    vendorID,
    vendorTypeID,
    description,
    filePath,
    amount,
    workCompleteDate,
    updateBy,
    ipAddress,
  })
}

//Update
export function UpdateWorkOrderRequestList_PMC_API(
  workOrderRequestID: number,
  assignDate: string,
  projectID: number,
  vendorID: number,
  vendorTypeID: string,
  workStageID: number,
  description: string,
  filePath: string,
  amount: number,
  workCompleteDate: string,
  updateBy: number,
  ipAddress: string
) {
  return axios.post(WorkOrderRequest_PMC_Update, {
    workOrderRequestID,
    assignDate,
    projectID,
    vendorID,
    vendorTypeID,
    workStageID,
    description,
    filePath,
    amount,
    workCompleteDate,
    updateBy,
    ipAddress,
  })
}

export function DeleteWorkOrderRequestByIDApi(workOrderRequestID: number) {
  return axios.post(Delete_WorkOrderRequest_ByID, {workOrderRequestID})
}
