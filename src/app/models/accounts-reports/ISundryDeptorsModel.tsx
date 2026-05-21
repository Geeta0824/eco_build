export interface ISundryDebtorsModel {
  projectVendorID: number
  vendorid: number
  projectID: number
  projectName: string
  remarks: string
  projectAmount: number
  finalAmount: number
  addonItemTotalAmount: number
  paidAmount: number
  remainingamount: number
  statusName: string
  customerName: string
}
export const sundryDebtorsInitValues: ISundryDebtorsModel = {
  projectVendorID: 0,
  vendorid: 0,
  projectID: 0,
  projectName: '',
  remarks: '',
  projectAmount: 0,
  finalAmount: 0,
  addonItemTotalAmount: 0,
  paidAmount: 0,
  remainingamount: 0,
  statusName: '',
  customerName: '',
}
