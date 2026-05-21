import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL
// =================Premium Quotation URL=====================
export const GET_Premium_QUOTATION = `${BASE_API_URL}/Quotation/GetPremiumQuotationList`
export const CREATE_Premium_QUOTATION = `${BASE_API_URL}/Quotation/MakePremiumStarndarQuotation`

export function GetPremiumQuotationListApi(employeeID: number,customerID:number,searchText:string){
  return axios.post(GET_Premium_QUOTATION,{employeeID,customerID,searchText})
}

export function createPremiumQuotationApi(
  customerID: number,
  carpetAreaID: number,
  bhkID: number,
  // projectTypeID: number,
  createBy: number,
  ipAddress: string
) {
  let projectTypeID = 3;
  return axios.post(CREATE_Premium_QUOTATION, {
    customerID,
    carpetAreaID,
    bhkID,
    projectTypeID,
    createBy,
    ipAddress,
  })
}
