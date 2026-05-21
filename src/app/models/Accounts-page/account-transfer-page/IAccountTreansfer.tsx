import moment from 'moment'

export interface IAccountTransferModel {
  projectAmount: number
  accountTransferID: number
  projectCategoryName: string
  projectName: string
  paymentID: number
  projectNumber: string
  projectTypeID: number
  date: string
  remainigAmt: number
  // cashAccountTypeID: number
  email: string
  // cashAccountTypeName: string
  fromCashAccountID: number
  toCashAccountID: number
  fromCashAccountTypeID: number
  toCashAccountTypeID: number
  bankID: number
  mobileNumber: number
  receiveAmt: number
  paidAmount: number
  customerName: string
  projectStatusName: string
  isActive: boolean
  FromSubaccountID: number
  ToSubaccontID: number
  // ------ Add Fund Field------
  projectID: number
  transferDate: string
  createByName: string
  accountName: string
  paymentMode: string
  fundReceiveID: number
  amount: number
  transactionMode: string

  cashAccountBankID: number
  projectInvoiceNo: string

  accountBalance: number

  cashEmployeeBalanceID: number
  cashAccontToSubID: number
  cashAccontFromSubID: number

  // transferDate: string

  fromAccountID: number
  fromSubAccountID: number
  toAccountID: number
  toSubAccountID: number
  transactionModeID: number
  transactionID: string
  chequeBankName: string
  chequeBankBranch: string
  chequeDate: string
  chequeAmount: number
  chequeNumber: string
  description: string
  filePath: string
  createBy: number
  ipAddress: string

  fromAccountName: string
  fromSubAccountName: string
  toAccountName: string
  toSubAccountName: string

}
export const accountTransferInitValues: IAccountTransferModel = {
  projectAmount: 0,
  accountName: '',
  transactionMode: '',
  projectCategoryName: '',
  accountTransferID: 0,
  projectName: '',
  paymentID: 0,
  projectNumber: '',
  projectTypeID: 0,
  date: moment(new Date()).format('YYYY-MM-DD'),
  remainigAmt: 0,
  email: '',
  fromCashAccountID: 0,
  toCashAccountID: 0,
  fromCashAccountTypeID: 0,
  toCashAccountTypeID: 0,
  bankID: 0,
  mobileNumber: 0,
  receiveAmt: 0,
  paidAmount: 0,
  customerName: '',
  projectStatusName: '',
  isActive: false,
  FromSubaccountID: 0,
  ToSubaccontID: 0,
  projectID: 0,
  transferDate: moment(new Date()).format('YYYY-MM-DD'),
  createByName:'',
  paymentMode: '',
  fundReceiveID: 0,
  amount: 0,
  transactionModeID: 0,
  transactionID: '',
  chequeBankName: '',
  chequeBankBranch: '',
  chequeDate: '',
  chequeAmount: 0,
  chequeNumber: '',
  cashAccountBankID: 0,
  projectInvoiceNo: '',
  description: '',
  filePath: '',
  createBy: 0,
  accountBalance: 0,
  ipAddress: '',
  cashEmployeeBalanceID: 0,
  cashAccontToSubID: 0,
  cashAccontFromSubID: 0,

  // transferDate: '',

  fromAccountID: 0,
  fromSubAccountID: 0,
  toAccountID: 0,
  toSubAccountID: 0,


  fromAccountName: '',
  fromSubAccountName: '',
  toAccountName: '',
  toSubAccountName: '',
}

export interface ISubAccountTransferModel {
  cashEmployeeBalanceID: number
  cashSubAccountName: string
}
