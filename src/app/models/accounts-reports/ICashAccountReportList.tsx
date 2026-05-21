export interface ICashAccountReportList {
  cashAccountID: number
  cashAccountTypeID: number
  employeeID: number
  organisationBankID: number
  totalBalance: number
  accountBalance: number
  employeeName: string
  cashAccountName: string
  cashEmployeeSubTypeID: number
  cashEmployeeSubTypeName: string
  titleName: string
  titleID: number
}
export const CashAccountReportInitValues: ICashAccountReportList = {
  cashAccountID: 0,
  cashAccountTypeID: 0,
  employeeID: 0,
  organisationBankID: 0,
  totalBalance: 0,
  accountBalance: 0,
  employeeName: '',
  cashAccountName: '',
  cashEmployeeSubTypeID: 0,
  cashEmployeeSubTypeName: '',
  titleName: '',
  titleID: 0,
}
export interface ITotalBalanceModel {
  totalBalance: number
}
export interface ICashReportLedgerModel {
    accountName: string
}

export interface ICashAccountLedgerList {
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
  contactPerson: string
}
export const cashAccountLedgerInitValues: ICashAccountLedgerList = {
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
    contactPerson: '',
}