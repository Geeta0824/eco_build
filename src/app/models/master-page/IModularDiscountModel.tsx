export interface IModularDiscountModel {
    discountID: number
    branchID: number
    discountPercentage: string
    branchName: string
  }
  export const modularDiscountInitValue: IModularDiscountModel = {
    discountID: 0,
    branchID: 0,
    discountPercentage: '',
    branchName: '',
  }
  