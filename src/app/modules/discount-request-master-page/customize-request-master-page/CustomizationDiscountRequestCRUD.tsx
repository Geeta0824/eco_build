import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL

// =================Discount URL=====================
export const GET_DISCOUNT_REQUEST_LIST = `${BASE_API_URL}/CustomQuotation/GetReqListForExtraDiscForAdminCustQuot` //Get Discount List
export const GET_STATUS_LIST = `${BASE_API_URL}/Quotation/GetDiscountStatusList` //Get Discount Status List
export const RESP_EXTRA_DISCOUNT_BY_ADMIN = `${BASE_API_URL}/CustomQuotation/RespForExtraDisctByAdminCustQuot` //Get Discount Status List

// =========================Get Discount=====================
export function getDiscountListApi(employeeID: number, customerID: number, searchText: string) {
  return axios.post(GET_DISCOUNT_REQUEST_LIST, {employeeID, customerID, searchText})
}

// =========================Get Discount=====================
export function GetDiscountStatusListApi() {
  return axios.post(GET_STATUS_LIST, {employeeID: 0, customerID: 0, searchText: ''})
}

// =========================Get Discount=====================
export function RespForExtraDisctByAdminApi(
  responseBy: number,
  quotationID: number,
  apprvDisc: number,
  discountStatusID: number,
  discCondition: any
) {
  return axios.post(RESP_EXTRA_DISCOUNT_BY_ADMIN, {
    responseBy,
    quotationID,
    apprvDisc,
    discountStatusID,
    discCondition,
  })
}
