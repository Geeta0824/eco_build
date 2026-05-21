import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL
// =================Department URL=====================
export const GET_ALL_Project_List = `${BASE_API_URL}/Project/GetProjectList`
export const Add_Project_Details = `${BASE_API_URL}/Project/AddProjectDetails`
export const Edit_Project_Details = `${BASE_API_URL}/Project/UpdateProjectDetails`
export const GET_Project_By_Project_ID = `${BASE_API_URL}/Project/GetProjectByProjectID`
export const Delete_Project_Data = `${BASE_API_URL}/Project/DeleteProject`
export const Get_Project_Vendor_Map_Data_By_ProjectID_VendorID = `${BASE_API_URL}/Project/Get_AmtList_By_ProjectIDVendorID`
export const Add_Project_Status_History = `${BASE_API_URL}/Project/AddProjectStatusHistory`
export const Get_Project_Type_Dropdown_List = `${BASE_API_URL}/Project/GetProjectTypeDropdownList`
export const GetProjectTypeDropdownList_ForTree = `${BASE_API_URL}/Project/GetProjectTypeDropdownList_ForTree`
export const Get_Project_Dropdown_List_For_Drop_down = `${BASE_API_URL}/Project/GetProject_DropdownList_ForDropdown`
export const Get_Employee_List_With_Project_ID = `${BASE_API_URL}/Project/GetEmployeeListWithProjectID`
export const Add_Employee_MAP_Project_ID = `${BASE_API_URL}/Project/AddEmployeeByProjectD`
export const GET_ALL_Project_List_By_Role_ID = `${BASE_API_URL}/Project/GetProjectList_RoleID`
export const GetProjectList_RoleID_EmpID = `${BASE_API_URL}/Project/GetProjectList_RoleID_EmpID`
export const GetProjectList_RoleID_EmpID_Pagination = `${BASE_API_URL}/Project/GetProjectList_RoleID_EmpID_Pagination`
export const GetProjectDetailsList_ByProjectID = `${BASE_API_URL}/Project/GetProjectDetailsList_ByProjectID`

// ===================== User Map================
export function getAllProjectListByRoleIDAPI(roleID: number) {
  return axios.post(GET_ALL_Project_List_By_Role_ID, {roleID})
}

export function getAllProjectListByRoleIDAndEmployeeIDAPI_Pagination(
  roleID: number,
  empID: number,
  pageNumber: number,
  pageSize: number,
  searchText: string
) {
  return axios.post(GetProjectList_RoleID_EmpID_Pagination, {
    roleID,
    empID,
    pageNumber,
    pageSize,
    searchText,
  })
}

export function getAllProjectListByRoleIDAndEmployeeIDAPI(roleID: number, empID: number) {
  return axios.post(GetProjectList_RoleID_EmpID, {roleID, empID})
}
// ===================== User Map================
export function getEmployeeListWithProjectIDApi(projectID: number) {
  return axios.post(Get_Employee_List_With_Project_ID, {projectID})
}
// ===================== User Map================
export function addEmployeeByProjectIDApi(projectID: number, employeeIDs: string) {
  return axios.post(Add_Employee_MAP_Project_ID, {projectID, employeeIDs})
}
// =========================Get ProjectStatus_List=====================
export function getProjectForAllDropdownListDataAPI() {
  return axios.get(Get_Project_Dropdown_List_For_Drop_down)
}

export function createProjectStatusHistory(
  projectID: number,
  employeeID: number,
  stageID: number,
  ipAddress: string,
  statusDate: string
) {
  return axios.post(Add_Project_Status_History, {
    projectID,
    employeeID,
    stageID,
    ipAddress,
    statusDate,
  })
}
export function getAllProjectListAPI() {
  return axios.get(GET_ALL_Project_List)
}

export function getGetProjectDetailsList_ByProjectIDAPI(projectID: number) {
  return axios.post(GetProjectDetailsList_ByProjectID, {projectID})
}

export function GetProjectVendorMapDataByProjectIDVendorIDAPI(projectID: number, vendorID: number) {
  return axios.post(Get_Project_Vendor_Map_Data_By_ProjectID_VendorID, {projectID, vendorID})
}

export function AddProjectDetailsAPI(
  customerID: number,
  projectCategoryID: number,
  projectTypeID: number,
  bhkid: number,
  carpetAreaID: number,
  projectStatus: number,
  projectName: string,
  projectAmount: number,
  projectFilePath: string,
  quetFilePath: string,
  createBy: number,
  ipAddress: string,
  paidAmount: number,
  remainingAmount: number,
  pmcCostExpected: number,
  description: string,
  entryDate: string
) {
  return axios.post(Add_Project_Details, {
    customerID,
    projectCategoryID,
    projectTypeID,
    bhkid,
    carpetAreaID,
    projectStatus,
    projectName,
    projectAmount,
    projectFilePath,
    quetFilePath,
    createBy,
    ipAddress,
    paidAmount,
    remainingAmount,
    pmcCostExpected,
    description,
    entryDate,
  })
}
export function getProjectByProjectIdAPI(projectID: number) {
  return axios.post(GET_Project_By_Project_ID, {projectID})
}
export function EditProjectDetailsAPI(
  projectID: number,
  customerID: number,
  projectCategoryID: number,
  projectTypeID: number,
  bhkid: number,
  carpetAreaID: number,
  projectStatus: number,
  projectName: string,
  projectAmount: number,
  projectFilePath: string,
  quetFilePath: string,
  updateBy: number,
  ipAddress: string,
  paidAmount: number,
  remainingAmount: number,
  pmcCostExpected: number,
  description: string,
  entryDate: string,
  latitude: string,
  longitude: string
) {
  return axios.post(Edit_Project_Details, {
    projectID,
    customerID,
    projectCategoryID,
    projectTypeID,
    bhkid,
    carpetAreaID,
    projectStatus,
    projectName,
    projectAmount,
    projectFilePath,
    quetFilePath,
    updateBy,
    ipAddress,
    paidAmount,
    remainingAmount,
    pmcCostExpected,
    description,
    entryDate,
    latitude,
    longitude,
  })
}
export function DeleteProjectDataAPI(projectID: number) {
  return axios.post(Delete_Project_Data, {projectID})
}

export function GetProjectTypeDropdownListAPI() {
  return axios.get(Get_Project_Type_Dropdown_List)
}

export function GetProjectTypeDropdownList_ForTreeAPI() {
  return axios.get(GetProjectTypeDropdownList_ForTree)
}
