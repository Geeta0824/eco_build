import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL
//=====================Terminal Type URL=========================
export const GET_ALL_TERMINAL_TYPE = `${BASE_API_URL}/TerminalType/GetTerminalTypeList`
export const ADD_TERMINAL_TYPE = `${BASE_API_URL}/TerminalType/AddTerminalTypeDetails`
export const UPDATE_TERMINAL_TYPE = `${BASE_API_URL}/TerminalType/UpdateTerminalTypeDetails`
export const GET_TERMINAL_TYPE_BY_TERMINAL_TYPE_ID = `${BASE_API_URL}/TerminalType/GetTerminalTypeByTerminalTypeID`
export const DELETE_TERMINAL_TYPE = `${BASE_API_URL}/TerminalType/DeleteTerminalType`
export const ISACTIVE_TERMINAL_TYPE = `${BASE_API_URL}/TerminalType/UpdateTerminalTypeIsactive`
export const GET_TERMINAL_TYPE_DROPDOWN_LIST = `${BASE_API_URL}/TerminalType/GetDropDownTerminalTypeList`

export function getAllTerminaTypeList() {
  return axios.get(GET_ALL_TERMINAL_TYPE)
}

export function getTerminalTypeDropdownList() {
  return axios.get(GET_TERMINAL_TYPE_DROPDOWN_LIST)
}

export function addTerminaType(
  terminalTypeName: string,
  isActive: boolean,
  createBy: number,
  ipAddress: string
) {
  return axios.post(ADD_TERMINAL_TYPE, {terminalTypeName, isActive, createBy, ipAddress})
}
export function updateTerminaType(
  terminalTypeID: number,
  terminalTypeName: string,
  isActive: boolean,
  updateBy: number,
  ipAddress: string
) {
  return axios.post(UPDATE_TERMINAL_TYPE, {
    terminalTypeID,
    terminalTypeName,
    isActive,
    updateBy,
    ipAddress,
  })
}
export function getTerminaTypeByTerminalTypeId(terminalTypeID: number) {
  return axios.post(GET_TERMINAL_TYPE_BY_TERMINAL_TYPE_ID, {terminalTypeID})
}
export function isActiveTerminaType(terminalTypeID: number, isActive: boolean) {
  return axios.post(ISACTIVE_TERMINAL_TYPE, {terminalTypeID, isActive})
}
export function deleteTerminaType(terminalTypeID: number) {
  return axios.post(DELETE_TERMINAL_TYPE, {terminalTypeID})
}
