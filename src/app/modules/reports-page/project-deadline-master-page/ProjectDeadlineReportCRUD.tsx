import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL
// =================Emp Education URL=====================
export const Get_Deadline_Report_By_TargateDate_Filter = `${BASE_API_URL}/AgencyWorkStage/Get_Deadline_Report_By_TargateDate_Filter`
export const Get_MissedDeadline_Report_By_TargateDate_Filter = `${BASE_API_URL}/AgencyWorkStage/Get_MissedDeadline_Report_By_TargateDate_Filter`
export const Get_Deadline_Report_By_TargateDate_EmpID_Filter = `${BASE_API_URL}/ProjectStageWise_Mobile/Get_Deadline_Report_By_TargateDate_EmpID_Filter`
export const Get_MissedDeadline_Report_By_TargateDate_EmpID_Filter = `${BASE_API_URL}/ProjectStageWise_Mobile/Get_MissedDeadline_Report_By_TargateDate_EmpID_Filter`

export function Get_Deadline_Report_By_TargateDate_FilterAPI(
  //employeeID: number,
  targetDate: string,
  searchText: string
) {
  return axios.post(Get_Deadline_Report_By_TargateDate_Filter, {targetDate, searchText})
}

export function Get_MissedDeadline_Report_By_TargateDate_FilterAPI(
  //employeeID: number,
  targetDate: string,
  searchText: string
) {
  return axios.post(Get_MissedDeadline_Report_By_TargateDate_Filter, {targetDate, searchText})
}

export function Get_Deadline_Report_By_TargateDate_EmpID_FilterAPI(
  employeeID: number,
  targetDate: string,
  searchText: string
) {
  return axios.post(Get_Deadline_Report_By_TargateDate_EmpID_Filter, {
    employeeID,
    targetDate,
    searchText,
  })
}

export function Get_MissedDeadline_Report_By_TargateDate_EmpID_FilterAPI(
  employeeID: number,
  targetDate: string,
  searchText: string
) {
  return axios.post(Get_MissedDeadline_Report_By_TargateDate_EmpID_Filter, {
    employeeID,
    targetDate,
    searchText,
  })
}
