import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL
export const GET_ALL_ORGANIZATION_BANK = `${BASE_API_URL}/OrganisationBank/GetOrganisationBankList`
export const DELETE_ORGANIZATION_BANK = `${BASE_API_URL}/OrganisationBank/DeleteOrganisationBank`
export const ISACTIVE_ORGANIZATION_BANK = `${BASE_API_URL}/OrganisationBank/UpdateOrganisationBankIsactive`
export const GET_ORGANIZATION_BANK_BY_ORGANIZATION_BANK_ID = `${BASE_API_URL}/OrganisationBank/GetOrganisationBankByOrganisationBankID`
export const UPDATE_ORGANIZATION_BANK = `${BASE_API_URL}/OrganisationBank/UpdateOrganisationBank`
export const ADD_ORGANIZATION_BANK = `${BASE_API_URL}/OrganisationBank/AddOrganisationBank`
// export const GET_ORGANIZATION_BANK_BY_WITHDRAW_TYPE_ID = `${BASE_API_URL}/OrganisationBank/GetOrganisationBankByWithdrawTypeID`

// export function getOrganizationBankByWithdrawTypeID(WithdrawTypeID: number) {
//   return axios.post(GET_ORGANIZATION_BANK_BY_WITHDRAW_TYPE_ID, {WithdrawTypeID})
// }
// ========================================================
export function getAllOrganizationBank() {
  return axios.get(GET_ALL_ORGANIZATION_BANK)
}
export function deleteOrganizationBank(organisationBankID: number) {
  return axios.post(DELETE_ORGANIZATION_BANK, {organisationBankID})
}
export function isActiveOrganizationBank(organisationBankID: number, isActive: boolean) {
  return axios.post(ISACTIVE_ORGANIZATION_BANK, {organisationBankID, isActive})
}
export function getOrganizationBankByOrganizationBankID(organisationBankID: number) {
  return axios.post(GET_ORGANIZATION_BANK_BY_ORGANIZATION_BANK_ID, {organisationBankID})
}
export function createOrganizationBank(
  bankTypeID: number,
  bankAccountTypeID: number,
  bankName: string,
  branchName: string,
  accountNumber: string,
  accountHolderName: string,
  ifscCode: string,
  micrCode: string,
  isActive: boolean,
  createBy: number,
  ipAddress: string
) {
  return axios.post(ADD_ORGANIZATION_BANK, {
    bankTypeID,
    bankAccountTypeID,
    bankName,
    branchName,
    accountNumber,
    accountHolderName,
    ifscCode,
    micrCode,
    isActive,
    createBy,
    ipAddress,
  })
}
export function updateOrganizationBank(
  organisationBankID: number,
  // bankTypeID: number,
  bankAccountTypeID: number,
  bankName: string,
  branchName: string,
  accountNumber: string,
  accountHolderName: string,
  ifscCode: string,
  micrCode: string,
  isActive: boolean,
  updateBy: number,
  ipAddress: string
) {
  return axios.post(UPDATE_ORGANIZATION_BANK, {
    organisationBankID,
    // bankTypeID,
    bankAccountTypeID,
    bankName,
    branchName,
    accountNumber,
    accountHolderName,
    ifscCode,
    micrCode,
    isActive,
    updateBy,
    ipAddress,
  })
}

