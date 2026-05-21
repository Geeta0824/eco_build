export interface ILedgerReportModel {
  ledgerID: number
  projectID: number
  vendorID: number
  voucherDate: string
  descriptions: string
  transactionTypeID: number
  amount: string
  balance: string
  voucherNumber: string
  transactionMode: string
  cashAccountName: string
  customerName: string
  projectName: string
  companyName: string
  searchText: string
  contactPerson: string
  ipAddress: string
  createBy: number
  updateBy: number
}
export const ledgerReportInitValues: ILedgerReportModel = {
  ledgerID: 0,
  projectID: 0,
  vendorID: 0,
  voucherDate: '',
  descriptions: '',
  transactionTypeID: 0,
  amount: '',
  balance: '',
  voucherNumber: '',
  transactionMode: '',
  cashAccountName: '',
  customerName: '',
  projectName: '',
  companyName: '',
  searchText: '',
  contactPerson: '',
  ipAddress: '',
  createBy: 0,
  updateBy: 0,
}
