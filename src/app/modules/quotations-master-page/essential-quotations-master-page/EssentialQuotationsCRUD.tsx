import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL
// =================Emp Education URL=====================
export const GET_ESSENTIAL_QUOTATION = `${BASE_API_URL}/Quotation/GetEssentialQuotationList`
export const CREATE_ESSENTIAL_QUOTATION = `${BASE_API_URL}/Quotation/MakePremiumStarndarQuotation`

export function GetEssentialQuotationList(
  employeeID: number,
  customerID: number,
  searchText: string
) {
  return axios.post(GET_ESSENTIAL_QUOTATION, {employeeID, customerID, searchText})
}

export function createEssentialQuotationsApi(
  customerID: number,
  carpetAreaID: number,
  bhkID: number,
  // projectTypeID: number,
  createBy: number,
  ipAddress: string
) {
  let projectTypeID = 4
  return axios.post(CREATE_ESSENTIAL_QUOTATION, {
    customerID,
    carpetAreaID,
    bhkID,
    projectTypeID,
    createBy,
    ipAddress,
  })
}
