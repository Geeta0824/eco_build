import axios from 'axios'
import {number} from 'yup'
const BASE_API_URL = process.env.REACT_APP_API_URL
// =================Change Password=====================
// export const Add_Project_Fund_Recive = `${BASE_API_URL}/Fund/AddProjectFundReceive`
export const Get_Company_Ledger_List_By_Filter = `${BASE_API_URL}/Reports/GetCompanyLedgerListByFilter`
export const Export_Excel_Ledger_Report_List = `${BASE_API_URL}/Reports/GetCompanyLedgerList_ExportExcel`

export function getCompanyLedgerListByFilterApi(
  searchText: string,
  startDate: string,
  endDate: string
) {
  return axios.post(Get_Company_Ledger_List_By_Filter, {searchText, startDate, endDate})
}
export function ExportExcelCompanyLedgerReportApi(
  searchText: string,
  startDate: string,
  endDate: string
) {
  return axios.post(Export_Excel_Ledger_Report_List, {searchText, startDate, endDate})
}
