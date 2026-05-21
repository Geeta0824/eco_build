import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL

// =====================Document Category URL======================
export const GetDesignerEmployeeDropdownList = `${BASE_API_URL}/DesignerTicketCategory/GetDesignerEmployeeDropdownList`
export const GetGenerateTicketList = `${BASE_API_URL}/GenerateTicket/GetGenerateTicketList`
export const AddGenerateTicketDetails = `${BASE_API_URL}/GenerateTicket/AddGenerateTicketDetails`
export const UpdateGenerateTicketDetails = `${BASE_API_URL}/GenerateTicket/UpdateGenerateTicketDetails`
export const GetGenerateTicketByTicketID = `${BASE_API_URL}/GenerateTicket/GetGenerateTicketByTicketID`
export const DeleteGenerateTicket = `${BASE_API_URL}/GenerateTicket/DeleteGenerateTicket`
export const ResponseGenerateTicket_ByDesigner = `${BASE_API_URL}/GenerateTicket/ResponseGenerateTicket_ByDesigner_Mobile`
export const GetHeadOfDepartment_Dropdwon_List_ByID = `${BASE_API_URL}/GeneratePenalty/GetHeadOfDepartment_Dropdwon_List_ByID`
export const GetEmployee_DropdownListByProjectIDAndDepartmentID = `${BASE_API_URL}/GeneratePenalty/GetEmployee_DropdownListByProjectIDAndDepartmentID`
export const GetVendor_DropdownListByProjectID = `${BASE_API_URL}/GeneratePenalty/GetVendor_DropdownListByProjectID`
export const GetEmployeeListByDepartmentID = `${BASE_API_URL}/Employee/GetEmployeeListByDepartmentID`

export function getDesignerEmployeeDropdownListAPI() {
  return axios.get(GetDesignerEmployeeDropdownList)
}

export function getGetGenerateTicketListAPI(
  employeeID: number,
  roleID: number,
  designationID: number
) {
  return axios.post(GetGenerateTicketList, {employeeID, roleID, designationID})
}

export function AddGenerateTicketDetailsAPI(
  projectID: number,
  assignTo: number,
  categoryID: number,
  photoPath: string,
  ticketRemarks: string,
  dueDate: string,
  ticketBy: number,
  createBy: number,
  ipAddress: string
) {
  return axios.post(AddGenerateTicketDetails, {
    projectID,
    assignTo,
    categoryID,
    photoPath,
    ticketRemarks,
    dueDate,
    ticketBy,
    createBy,
    ipAddress,
  })
}

export function UpdateGenerateTicketDetailsAPI(
  ticketID: number,
  projectID: number,
  assignTo: number,
  categoryID: number,
  photoPath: string,
  ticketRemarks: string,
  dueDate: string,
  ipAddress: string
) {
  return axios.post(UpdateGenerateTicketDetails, {
    ticketID,
    projectID,
    assignTo,
    categoryID,
    photoPath,
    ticketRemarks,
    dueDate,
    ipAddress,
  })
}

export function GetGenerateTicketByTicketIDAPI(ticketID: number) {
  return axios.post(GetGenerateTicketByTicketID, {ticketID})
}

export function DeleteGenerateTicketAPI(ticketID: number) {
  return axios.post(DeleteGenerateTicket, {ticketID})
}

export function ResponseGenerateTicket_ByDesignerAPI(
  ticketID: number,
  resposeBy: number,
  resposePhotoPath: string,
  resposeRemarks: string,
  ipAddress: string
) {
  return axios.post(ResponseGenerateTicket_ByDesigner, {
    ticketID,
    resposeBy,
    resposePhotoPath,
    resposeRemarks,
    ipAddress,
  })
}

export function GetHeadOfDepartment_Dropdwon_List_ByIDAPI(projectID: number, departmentID: number) {
  return axios.post(GetHeadOfDepartment_Dropdwon_List_ByID, {projectID, departmentID})
}

export function GetEmployee_DropdownListByProjectIDAndDepartmentIDAPI(
  projectID: number,
  departmentID: number
) {
  return axios.post(GetEmployee_DropdownListByProjectIDAndDepartmentID, {
    projectID,
    departmentID,
  })
}

export function GetVendor_DropdownListByProjectIDAPI(projectID: number) {
  return axios.post(GetVendor_DropdownListByProjectID, {
    projectID,
  })
}

export function GetEmployee_ListByDepartmentIDAPI(
  departmentID: number
) {
  return axios.post(GetEmployeeListByDepartmentID, {
    departmentID,
  })
}