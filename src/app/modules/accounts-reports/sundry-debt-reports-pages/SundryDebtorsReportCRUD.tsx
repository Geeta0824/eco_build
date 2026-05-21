import axios from 'axios'
import {number} from 'yup'
const BASE_API_URL = process.env.REACT_APP_API_URL
// =================Sundry Debtors=====================

export const Get_Sundry_Debtors_List = `${BASE_API_URL}/ProjectStatus/GetSundryDebitorsList`
export const ExportExcelSundryDebtorsListByFilter = `${BASE_API_URL}/ProjectStatus/ExportExcelSundryDebitor_Excel`

export function getSundryDebtorsListApi(
) {
  return axios.get(Get_Sundry_Debtors_List)
}

export function ExportExcelSundryDebtorsListApi(
) {
  return axios.get(ExportExcelSundryDebtorsListByFilter)
}
