export interface IOfferModel {
  offerID: number
  offerDesc: string
  offerTitle: string
  createBy: number
  offerPercentage: number
  iPAddress: string
  isPriceEffect: boolean
}
export const offerInitValue: IOfferModel = {
  offerID: 0,
  offerDesc: '',
  offerTitle: '',
  createBy: 0,
  offerPercentage: 0,
  iPAddress: '',
  isPriceEffect: false,
}

export interface IBranchModelForOfferMap {
  branchID: number
  branchName: string
  isBranch: number
}
