import moment from 'moment'

export interface IVendorReductionItemModel {
  projectVendorReductionID: number
  projectID: number
  projectVendorID: number
  vendorID: number
  remarks: string
  reductionCost: number
  reductionDate: string
}

export const venReductionItemModelInitValues: IVendorReductionItemModel = {
  projectVendorReductionID: 0,
  projectID: 0,
  projectVendorID: 0,
  vendorID: 0,
  remarks: '',
  reductionCost: 0,
  reductionDate: moment(new Date()).format('YYYY-MM-DD'),
}
