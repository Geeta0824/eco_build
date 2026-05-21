import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL

// =================Get  Design-And-Consultancy Discount URL=====================
export const GET_DISCOUNT_REQUEST_LIST = `${BASE_API_URL}/DNC/GetReqListForExtraDiscForAdmin` //Get Discount List
export const GET_STATUS_LIST = `${BASE_API_URL}/Quotation/GetDiscountStatusList` //Get Discount Status List
export const RESP_EXTRA_DISCOUNT_BY_ADMIN = `${BASE_API_URL}/DNC/RespForExtraDisctByAdmin` //Get Discount Status List

// =========================Get  Design-And-Consultancy Discount=====================
export function getDiscountListApi(employeeID: number, customerID: number, searchText: string) {
  return axios.post(GET_DISCOUNT_REQUEST_LIST, {employeeID, customerID, searchText})
}

// =========================Get  Design-And-Consultancy Discount=====================
export function GetDiscountStatusListApi() {
  return axios.post(GET_STATUS_LIST, {employeeID: 0, customerID: 0, searchText: ''})
}

// ========================= Get  Design-And-Consultancy Discount=====================
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
