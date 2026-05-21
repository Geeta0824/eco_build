export interface ISundryCreditorsModel {
  projectVendorID:number
  vendorid:number
  projectID:number
  projectName: string
  remarks: string
  vendorCost:number
  paidAmount:number
  remainingamount:number
  vendorName: string
  customerName: string
}
export const sundryCreditorsInitValues: ISundryCreditorsModel = {
    projectVendorID: 0,
    vendorid: 0,
    projectID: 0,
    projectName: '',
    remarks: '',
    vendorCost: 0,
    paidAmount: 0,
    remainingamount: 0,
    vendorName: '',
    customerName: '',
}
