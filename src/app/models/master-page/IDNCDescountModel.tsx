export interface IDNCDescountModel {
    discountID: number
    branchID: number
    discountPercentage: string
    branchName: string
  }
  export const DIYdiscountInitValue: IDNCDescountModel = {
    discountID: 0,
    branchID: 0,
    discountPercentage: '',
    branchName: '',
  }
  