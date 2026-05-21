import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL
// =================Change Password=====================
export const CHANGE_PASSWORD = `${BASE_API_URL}/Employee/ChangePassword`
export const CUSTOMER_PASSWORD_RESET = `${BASE_API_URL}/Customer/ChangPwdByAdmin`
export const USER_PASSWORD_RESET = `${BASE_API_URL}/User/ChangUserPwdByAdmin`

export function employeeChangePassword(EmployeeID: number, OldPwd: string, NewPwd: string) {
  return axios.post(CHANGE_PASSWORD, {EmployeeID, OldPwd, NewPwd})
}
export function CustomerPasswordReset(customerID: number, newPwd: string) {
  return axios.post(CUSTOMER_PASSWORD_RESET, {customerID, newPwd})
}
export function UserPasswordReset(userID: number, newPwd: string) {
  return axios.post(USER_PASSWORD_RESET, {userID, newPwd})
}
