import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL
export const Get_Project_Profit_Loss_Report = `${BASE_API_URL}/Reports/GetProjectProfitLossReport`
export const ExportExcel_GetProjectProfit_LossReport = `${BASE_API_URL}/Reports/ExportExcel_GetProjectProfitLossReport`

export function getProjectProfitLossReportListByFilterApi(
  pmcWorkStageID: number,
  projectID: number
) {
  return axios.post(Get_Project_Profit_Loss_Report, {pmcWorkStageID, projectID})
}

export function ExportExcelGetProjectProfitLossReportAPI(
  pmcWorkStageID: number,
  projectID: number
) {
  return axios.post(ExportExcel_GetProjectProfit_LossReport, {pmcWorkStageID, projectID})
}
