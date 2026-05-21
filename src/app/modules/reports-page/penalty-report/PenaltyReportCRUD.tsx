import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL
// =================Emp Education URL=====================
export const Get_Generated_Penalty_Report_By_VendorID_ProjectID_Filter = `${BASE_API_URL}/GeneratePenalty/Get_Generated_Penalty_Report_By_VendorID_ProjectID_Filter`
export const Get_Generated_Penalty_Report_By_EmployeeID_ProjectID_Filter = `${BASE_API_URL}/GeneratePenalty/Get_Generated_Penalty_Report_By_EmployeeID_ProjectID_Filter`

export function Get_Generated_Penalty_Report_By_VendorID_ProjectID_FilterAPI(
  projectID: number,
  empVendorID: number,
  date: string
) {
  return axios.post(Get_Generated_Penalty_Report_By_VendorID_ProjectID_Filter, {
    projectID,
    empVendorID,
    date,
  })
}

export function Get_Generated_Penalty_Report_By_EmployeeID_ProjectID_FilterAPI(
  projectID: number,
  departmentID: number,
  empVendorID: number,
  date: string
) {
  return axios.post(Get_Generated_Penalty_Report_By_EmployeeID_ProjectID_Filter, {
    projectID,
    departmentID,
    empVendorID,
    date,
  })
}
