import axios from 'axios'
import {number} from 'yup'
const BASE_API_URL = process.env.REACT_APP_API_URL
// =================Change Password=====================
// export const Add_Project_Fund_Recive = `${BASE_API_URL}/Fund/AddProjectFundReceive`
export const Get_Cash_Account_Report_By_Filter = `${BASE_API_URL}/CashAccountReport/GetCashAccountReportList`
export const Get_Cash_Account_ExcelReport_By_Filter = `${BASE_API_URL}/CashAccountReport/ExportToExcelCashAccountReportList`

export const Get_Cash_Account_Ledger_List_By_Filter = `${BASE_API_URL}/Reports/GetCashAccountLedgerListByFilter`
export const Export_Excel_Cash_Account_Ledger_List = `${BASE_API_URL}/Reports/GetCashAccountLedgerList_View_ExportExcel`

export function getcashAccountReportListApi() {
  return axios.get(Get_Cash_Account_Report_By_Filter, {})
}


export function ExcelcashAccountReportListApi() {
  return axios.get(Get_Cash_Account_ExcelReport_By_Filter, {})
}
export function getCashAccountLedgerListByFilterApi(
  cashAccountID: number,
  startDate: string,
  endDate: string
) {
  return axios.post(Get_Cash_Account_Ledger_List_By_Filter, {cashAccountID, startDate, endDate})
}
export function ExportExcelCashAccountListApi(
  cashAccountID: number,
  startDate: string,
  endDate: string
) {
  return axios.post(Export_Excel_Cash_Account_Ledger_List, {cashAccountID, startDate, endDate})
}
