import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL

// =================Role URL=====================
export const GET_ALL_ROLE = `${BASE_API_URL}/Role/GetRoleList` //Get Role

// =========================Get Role=====================
export function getRoleApi() {
  return axios.get(GET_ALL_ROLE)
}