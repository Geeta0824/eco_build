import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL
export const Get_Company_Profit_Loss_Report = `${BASE_API_URL}/Reports/GetCompanyProfitLossReport`
export const Excel_GetCompany_ProfitLoss_Report = `${BASE_API_URL}/Reports/Excel_GetCompanyProfitLossReport`

export function getCompanyProfitLossReportListByFilterApi(yearID: number, monthID: number) {
  return axios.post(Get_Company_Profit_Loss_Report, {yearID, monthID})
}

export function getCompanyProfitLossReportExcelApi(yearID: number, monthID: number) {
  return axios.post(Excel_GetCompany_ProfitLoss_Report, {yearID, monthID})
}
