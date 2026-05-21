import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL
// =================Emp Education URL=====================
export const GET_STANDARD_QUOTATION = `${BASE_API_URL}/Quotation/GetStandarQuotationList`
export const CREATE_Standard_QUOTATION = `${BASE_API_URL}/Quotation/MakePremiumStarndarQuotation`

export function GetStandarQuotationList(employeeID: number,customerID:number,searchText:string) {
  return axios.post(GET_STANDARD_QUOTATION, {employeeID,customerID,searchText})
}

export function createStandardQuotationsApi(
  customerID: number,
  carpetAreaID: number,
  bhkID: number,
  // projectTypeID: number,
  createBy: number,
  ipAddress: string
) {
  let projectTypeID = 2
  return axios.post(CREATE_Standard_QUOTATION, {
    customerID,
    carpetAreaID,
    bhkID,
    projectTypeID,
    createBy,
    ipAddress,
  })
}
