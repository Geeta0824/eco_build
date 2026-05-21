import axios from 'axios'

const BASE_API_URL = process.env.REACT_APP_API_URL

// ================= URL=====================
export const Get_Tracking_LogHistory_ByStatus = `${BASE_API_URL}/Employee_Available/GetTrackingLogHistoryByStatus`

export function GetTrackingLogHistoryByStatusApi(status: string) {
  return axios.post(Get_Tracking_LogHistory_ByStatus, {status})
}