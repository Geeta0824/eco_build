import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL
// =================Discount URL=====================
export const GET_ALL_MODULAR_DISCOUNT = `${BASE_API_URL}/ModularDiscount/GetModularDiscountList`
export const GET_MODULAR_DISCOUNT_BY_DISCOUNT_ID = `${BASE_API_URL}/ModularDiscount/GetModularDiscountByDiscountID`
export const UPDATE_MODULAR_DISCOUNT = `${BASE_API_URL}/ModularDiscount/UpdateModularDiscount`
export const ADD_MODULAR_DISCOUNT = `${BASE_API_URL}/ModularDiscount/AddModularDiscount`

export function getAllModularDiscount() {
  return axios.get(GET_ALL_MODULAR_DISCOUNT)
}

export function getModularDiscountByDiscountId(discountID: string) {
  return axios.post(GET_MODULAR_DISCOUNT_BY_DISCOUNT_ID, {discountID})
}
export function updateModularDiscount(
  discountID: number,
  discountPercentage: string,
  branchID: number
) {
  return axios.post(UPDATE_MODULAR_DISCOUNT, {
    discountID,
    discountPercentage,
    branchID,
  })
}
export function AddModularDiscountAPI(discountPercentage: string, branchID: number) {
  return axios.post(ADD_MODULAR_DISCOUNT, {
    discountPercentage,
    branchID,
  })
}
