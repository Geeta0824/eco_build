import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL

//=====================User URL======================
export const GET_ALL_USER = `${BASE_API_URL}/User/GetUserWebList` //Get User Page
export const CREATE_USER = `${BASE_API_URL}/User/AddUserDetails` //Get User Page
export const UPDATE_USER = `${BASE_API_URL}/User/UpdateUserDetails` //Get User Page
export const GET_USER_BY_USER_ID = `${BASE_API_URL}/User/GetUserByUserID` //Get User Page
export const DELETE_USER = `${BASE_API_URL}/User/DeleteUser` //Get User Page
export const ISACTIVE_USER = `${BASE_API_URL}/User/UpdateUserIsactive` //Get User Page

export function getAllUserList() {
  return axios.get(GET_ALL_USER)
}
export function addUser(
  employeeID: number,
  departmentID: number,
  roleID: number,
  isActive: boolean,
  createBy: number,
  ipAddress: string
) {
  return axios.post(CREATE_USER, {
    employeeID,
    departmentID,
    roleID,
    isActive,
    createBy,
    ipAddress,
  })
}
export function editUser(
  userID: number,
  employeeID: number,
  departmentID: number,
  roleID: number,
  isActive: boolean,
  updateBy: number,
  ipAddress: string
) {
  return axios.post(UPDATE_USER, {
    userID,
    employeeID,
    departmentID,
    roleID,
    isActive,
    updateBy,
    ipAddress,
  })
}
export function deleteUser(userID: number) {
  return axios.post(DELETE_USER, {userID})
}
export function getUserByUserID(userID: number) {
  return axios.post(GET_USER_BY_USER_ID, {userID})
}
export function isActiveUser(userID: number, isActive: boolean) {
  return axios.post(ISACTIVE_USER, {userID, isActive})
}
