import axios from 'axios'
const BASE_API_URL = process.env.REACT_APP_API_URL
// =================Discount URL=====================
export const GET_ALL_DISCOUNT = `${BASE_API_URL}/CarpetryDiscount/GetDiscountList`
export const GET_DISCOUNT_BY_DISCOUNT_ID = `${BASE_API_URL}/CarpetryDiscount/GetDiscountByDiscountID`
export const UPDATE_DISCOUNT = `${BASE_API_URL}/CarpetryDiscount/UpdateDiscount`
export const Add_DISCOUNT = `${BASE_API_URL}/CarpetryDiscount/AddDiscount`

export function getAllDiscount() {
  return axios.get(GET_ALL_DISCOUNT)
}

export function getDiscountByDiscountId(discountID: string) {
  return axios.post(GET_DISCOUNT_BY_DISCOUNT_ID, {discountID})
}

export function updateDiscount(discountID: number, discountPercentage: string, branchID: number) {
  return axios.post(UPDATE_DISCOUNT, {
    discountID,
    discountPercentage,
    branchID,
  })
}
export function AddCarpentaryDiscountAPI(discountPercentage: string, branchID: number) {
  return axios.post(Add_DISCOUNT, {
    discountPercentage,
    branchID,
  })
}
