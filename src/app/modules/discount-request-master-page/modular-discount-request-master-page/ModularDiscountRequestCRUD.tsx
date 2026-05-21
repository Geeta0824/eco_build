import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL

// =================Modular Discount URL=====================
export const GET_MODULAR_DISCOUNT_REQUEST_LIST = `${BASE_API_URL}/ModularQuotation/GetModularReqListForExtraDiscForAdmin` //Get Modular Discount List

export const RESP_MODULAR_EXTRA_DISCOUNT_BY_ADMIN = `${BASE_API_URL}/ModularQuotation/RespForModularExtraDisctByAdmin` //Get Modular Discount Status List

// =========================Get Modular Discount=====================
export function getModularDiscountListApi(
  employeeID: number,
  customerID: number,
  searchText: string
) {
  return axios.post(GET_MODULAR_DISCOUNT_REQUEST_LIST, {employeeID, customerID, searchText})
}

// =========================Get Modular Discount=====================
export function RespForModularExtraDisctByAdminApi(
  responseBy: number,
  quotationID: number,
  apprvDisc: number,
  discountStatusID: number,
  discCondition: any
) {
  return axios.post(RESP_MODULAR_EXTRA_DISCOUNT_BY_ADMIN, {
    responseBy,
    quotationID,
    apprvDisc,
    discountStatusID,
    discCondition,
  })
}
