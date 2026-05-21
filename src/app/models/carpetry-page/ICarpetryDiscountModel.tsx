export interface ICarpetryDiscountModel {
  discountID: number
  branchID: number
  discountPercentage: string
  branchName: string
}
export const carpetryDiscountInitValue: ICarpetryDiscountModel = {
  discountID: 0,
  branchID: 0,
  discountPercentage: '',
  branchName: '',
}
