import axios from 'axios'
import {number} from 'yup'
const BASE_API_URL = process.env.REACT_APP_API_URL
// =================Change Password=====================
// export const Add_Project_Fund_Recive = `${BASE_API_URL}/Fund/AddProjectFundReceive`
export const Get_Company_ProjectList_By_Filter = `${BASE_API_URL}/Reports/GetProjectLedgerListByFilter`
export const Export_Excel_Company_Project_List = `${BASE_API_URL}/Reports/GetProjectLedgerList_ExportExcel`

export function getCompanyProjectListByFilterApi(
  projectID: number,
  startDate: string,
  endDate: string
) {
  return axios.post(Get_Company_ProjectList_By_Filter, {projectID, startDate, endDate})
}
export function ExportExcelProjectReportListApi(
  projectID: number,
  startDate: string,
  endDate: string
) {
  return axios.post(Export_Excel_Company_Project_List, {projectID, startDate, endDate})
}
