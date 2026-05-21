import axios from 'axios'
import {number} from 'yup'
const BASE_API_URL = process.env.REACT_APP_API_URL
// =================Change Password=====================
// export const Add_Project_Fund_Recive = `${BASE_API_URL}/Fund/AddProjectFundReceive`
export const Get_ProjectList_By_Filter = `${BASE_API_URL}/Reports/GetProjectListByByFilter`
export const Get_Project_Type_Dropdown_List = `${BASE_API_URL}/Project/GetProjectTypeDropdownList`
export const ExportExcelProjectReportListByFilter = `${BASE_API_URL}/Reports/GetProjectLedgerList_ExportExcel `

export function getProjectListByFilterApi(
  pmcWorkStageID: number,
  startDate: string,
  endDate: string
) {
  return axios.post(Get_ProjectList_By_Filter, {pmcWorkStageID, startDate, endDate})
}

export function ExportExcelProjectListByByFilterApi(
  projectID: number,
  startDate: string,
  endDate: string
) {
  return axios.post(ExportExcelProjectReportListByFilter, {projectID, startDate, endDate})
}
