export interface IDiscountModel {
  discountID: number
  branchID: number
  discountPercentage: string
  branchName: string
}
export const discountInitValue: IDiscountModel = {
  discountID: 0,
  branchID: 0,
  discountPercentage: '',
  branchName: '',
}
