import moment from 'moment'

export interface IOtherFundReceiveModel {
  projectAmount: number
  projectCategoryName: string
  projectName: string
  paymentID: number
  projectNumber: string
  projectTypeID: number
  date: string
  remainigAmt: number
  remainingAmount: number
  cashAccountTypeID: number
  email: string
  cashAccountTypeName: string
  cashAccountID: number
  cashAccounID: number
  bankID: number
  mobileNumber: number
  receiveAmt: number
  paidAmount: number
  customerName: string
  projectStatusName: string
  isActive: boolean
  FromSubaccountID: number
  ToSubaccontID: number
  projectID: number
  projectInvoiceID: number
  paymentDate: string
  paymentMode: string
  fundReceiveID: number
  amount: number
  transactionModeID: number
  transactionID: string
  chequeBankName: string
  chequeBankBranch: string
  chequeDate: string
  chequeAmount: number
  chequeNumber: string
  cashAccountBankID: number
  projectInvoiceNo: string
  description: string
  filePath: string
  createBy: number
  accountBalance: number
  ipAddress: string
  cashEmployeeBalanceID: number
  cashAccontToSubID: number
  totalAmount: number
  gstAmount: number
  voucherNumber: string
  invoiceDate: string
  projectInvoiceAmount: number
  invoicePaidAmount: number
  isTcs: boolean
  tcsAmount: number
  tcsPercentage: number
  fundRecTypeID: number
  vendorTypeID: number
  payFromTypeID: number
  fromTypeID: number
}
export const otheerFundReceiveInitValues: IOtherFundReceiveModel = {
  projectName: '',
  FromSubaccountID: 0,
  ToSubaccontID: 0,
  projectAmount: 0,
  cashAccounID: 0,
  projectCategoryName: '',
  paymentID: 0,
  remainigAmt: 0,
  remainingAmount: 0,
  cashAccountTypeID: 0,
  cashAccountTypeName: '',
  projectNumber: '',
  projectTypeID: 0,
  fundReceiveID: 0,
  projectStatusName: '',
  date: moment(new Date()).format('YYYY-MM-DD'),
  cashAccountID: 0,
  bankID: 0,
  customerName: '',
  email: '',
  accountBalance: 0,
  mobileNumber: 0,
  receiveAmt: 0,
  paidAmount: 0,
  isActive: false,
  projectID: 0,
  projectInvoiceID: 0,
  paymentMode: '',
  paymentDate: moment(new Date()).format('YYYY-MM-DD'),
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
  ipAddress: '',
  cashEmployeeBalanceID: 0,
  cashAccontToSubID: 0,
  totalAmount: 0,
  gstAmount: 0,
  voucherNumber: '',
  invoiceDate: moment(new Date()).format('YYYY-MM-DD'),
  projectInvoiceAmount: 0,
  invoicePaidAmount: 0,
  isTcs: false,
  tcsAmount: 0,
  tcsPercentage: 0,
  fundRecTypeID: 0,
  vendorTypeID: 0,
  payFromTypeID: 0,
  fromTypeID: 0,
}

export interface IOtherFundRecListModel {
  otherPaymentID: number
  createBy: number
  vendorID: number
  franchiseID: number
  paymentFromID: number
  transactionModeID: number
  amount: number
  transactionID: string
  createByName: string
  paymentDate: string
  projectInvoiceNo: string
  voucherNo: string
  filePath: string
  companyName: string
  vendorContactPerson: string
  cashAccountName: string
  transactionMode: string
  franchieseFirstName: string
  franchieseLastName: string
  description: string
}
export interface IPaymentFromModel {
  fromID: number
  fromCode: string
  fromName: string
}

export interface IFranchiseModel {
  employeeID: number
  employeeCode: string
  firstName: string
  lastName: string
  email: string
  contactNumber: string
  departmentName: string
  designationName: string
  fullName: string
  roleID: number
  departmentID: number
  designationID: number
  isActive: true
  pwd: string
  branchCode: string
  branchName: string
  branchID: number
  kylasID: number
}
