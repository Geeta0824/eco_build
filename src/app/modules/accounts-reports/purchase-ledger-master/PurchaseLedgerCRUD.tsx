import axios from 'axios'
import {number} from 'yup'
const BASE_API_URL = process.env.REACT_APP_API_URL
// =================Change Password=====================
// export const Add_Project_Fund_Recive = `${BASE_API_URL}/Fund/AddProjectFundReceive`
export const Get_VendorReport_VenProjList_By_VendorID = `${BASE_API_URL}/VendorReport/Get_VendorProjList_By_VendorID`
export const Get_Project_List_By_Proj_VendorID = `${BASE_API_URL}/VendorReport/GetProjectList_By_Proj_Vend_ID`

export function getVendorReportListByVendorIdApi(vendorID: number) {
  return axios.post(Get_VendorReport_VenProjList_By_VendorID, {vendorID})
}
export function getProjectListByProjVendorIdApi(
  projectID: number,
  vendorID: number,
  startDate: string,
  endDate: string
) {
  return axios.post(Get_Project_List_By_Proj_VendorID, {projectID, vendorID, startDate, endDate})
}
