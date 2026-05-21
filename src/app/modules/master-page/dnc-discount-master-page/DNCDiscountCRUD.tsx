import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL
// =================Discount URL=====================
export const GET_ALL_DIY_DISCOUNT = `${BASE_API_URL}/DNCDiscount/GetDiscountList`
export const GET_DIY_DISCOUNT_BY_DISCOUNT_ID = `${BASE_API_URL}/DNCDiscount/GetDiscountByDiscountID`
export const UPDATE_DIY_DISCOUNT = `${BASE_API_URL}/DNCDiscount/UpdateDiscount`
export const ADD_DIY_DISCOUNT = `${BASE_API_URL}/DNCDiscount/AddDiscount`
// ==================================================================================
export function getAllDiyDiscount() {
  return axios.get(GET_ALL_DIY_DISCOUNT)
}

export function getDiyDiscountByDiscountId(discountID: string) {
  return axios.post(GET_DIY_DISCOUNT_BY_DISCOUNT_ID, {discountID})
}
export function updateDiyDiscount(discountID: number, discountPercentage: string, branchID: number) {
  return axios.post(UPDATE_DIY_DISCOUNT, {
    discountID,
    discountPercentage,
    branchID,
  })
}
export function AddDiyDiscountAPI(discountPercentage: string, branchID: number) {
  return axios.post(ADD_DIY_DISCOUNT, {
    discountPercentage,
    branchID,
  })
}
