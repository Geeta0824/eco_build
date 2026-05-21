import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL
// =================AddonM  Master URL=====================
export const GET_ALL_CARPETRY_MIN_AMOUNT = `${BASE_API_URL}/CarpetentryQuotationMinAmount/GetCarpetentryQuotationMinAmountList`
export const GET_MIN_AMOUNT_BY_MIN_AMOUNT_ID = `${BASE_API_URL}/CarpetentryQuotationMinAmount/GetAmountByID`
export const UPDATE_CARPETRY_MIN_AMOUNT = `${BASE_API_URL}/CarpetentryQuotationMinAmount/UpdateCarpetentryQuotationMinAmount`

export function getCarpetryMinAmountListApi() {
  return axios.get(GET_ALL_CARPETRY_MIN_AMOUNT)
}

export function getGetMinAmountByIDApi(carpetentryQutationMinAmountID: number) {
  return axios.post(GET_MIN_AMOUNT_BY_MIN_AMOUNT_ID, {carpetentryQutationMinAmountID})
}
export function updateCarpetryMinAmount(
  carpetentryQutationMinAmountID: number,
  minimumAmount: number
) {
  return axios.post(UPDATE_CARPETRY_MIN_AMOUNT, {
    carpetentryQutationMinAmountID,
    minimumAmount,
  })
}
