import axios from 'axios'

const BASE_API_URL = process.env.REACT_APP_API_URL

// ================= URL=====================
export const Get_TrackingLog_History_By_EmployeeID = `${BASE_API_URL}/Employee_Available/GetTrackingLogHistoryByEmployeeID`

export function getTrackingDataApi(employeeId: number, selDate: string) {
  return axios.post(Get_TrackingLog_History_By_EmployeeID, {employeeId, selDate})
}
// export function getTrackingDataApi(
//   employeeId: number
// ) {
//   const params = new URLSearchParams({
//     employeeId: employeeId.toString()
//   }).toString()

//   return axios.get(`${Get_TrackingLog_History_By_EmployeeID}?${params}`)
// }
